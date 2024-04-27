const marketplaceRepository = require('./marketplace-repository');

/**
 * Get products after search, sort and pagination
 * @param {String} search
 * @param {String} sortField
 * @param {String} sortOrder
 * @param {String} page_number
 * @param {String} page_size
 * @returns
 */
async function getProducts(
  search,
  sortField,
  sortOrder,
  page_number,
  page_size
) {
  // Cek parameter search adalah string dan mengubah search ke bentuk lowercase
  const searchString = typeof search === 'string' ? search.toLowerCase() : '';

  const products = await marketplaceRepository.getProducts();
  let filteredProducts = products;

  // Fungsi Search
  // Search berdasarkan parameter searchString kepada data product_name, brand dan category
  if (searchString) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product?.product_name?.toLowerCase().includes(searchString) || // Validasi sebelum memanggil toLowerCase
        product?.brand?.toLowerCase().includes(searchString) ||
        product?.category.toLowerCase().includes(searchString)
    );
  }

  // Fungsi Sort
  // Sort berdasarkan sortField sesuai query
  filteredProducts.sort((a, b) => {
    const aField = a?.[sortField]?.toLowerCase() || ''; // Default ke string kosong jika null atau undefined
    const bField = b?.[sortField]?.toLowerCase() || '';

    // Sort berdasarkan sortOrder sesuai query
    if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
    if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Fungsi Pagination
  // Pagination berdasarkan query page_size dan page_nmumber
  const total_pages = Math.ceil(products.length / page_size);
  const count = products.length;
  const has_previous_page = page_number > 1;
  const has_next_page = page_number < total_pages;

  // Menetapkan schema data productData yang aka di output sebagai hasil
  const productData = filteredProducts.map((product) => ({
    sku: product.sku,
    product_name: product.product_name,
    brand: product.brand,
    price: product.price,
    category: product.category,
  }));

  // Jika value dari query page_number atau page_size null maka fetch all data
  if (!page_number || !page_size) {
    return {
      page_number,
      page_size,
      count,
      total_pages,
      has_previous_page,
      has_next_page,
      data: productData,
    };
  } else {
    // Melakukan pagination sesuai query page_number dan page_size
    const offset = (page_number - 1) * page_size;
    const paginatedList = productData.slice(offset, offset + page_size);

    return {
      page_number,
      page_size,
      count,
      total_pages,
      has_previous_page,
      has_next_page,
      data: paginatedList,
    };
  }
}

/**
 * Get product detail
 * @param {string} sku - Product Sku
 * @returns {Object}
 */
async function getProduct(sku) {
  const product = await marketplaceRepository.getProduct(sku);

  // Product not found
  if (!product) {
    return null;
  }

  return {
    sku: product.sku,
    product_name: product.product_name,
    brand: product.brand,
    price: product.price,
    category: product.category,
  };
}

/**
 * Create new product
 * @param {String} product_name
 * @param {String} brand
 * @param {String} price
 * @param {String} category
 * @returns
 */
async function createProduct(product_name, brand, price, category) {
  try {
    await marketplaceRepository.createProduct(
      product_name,
      brand,
      price,
      category
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing product
 * @param {String} sku
 * @param {String} product_name
 * @param {String} brand
 * @param {String} category
 * @returns
 */
async function updateProduct(sku, product_name, brand, category) {
  const product = await marketplaceRepository.getProduct(sku);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await marketplaceRepository.updateProduct(
      sku,
      product_name,
      brand,
      category
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete product
 * @param {string} sku - Product Sku
 * @returns {boolean}
 */
async function deleteProduct(sku) {
  const product = await marketplaceRepository.getProduct(sku);

  // Product not found
  if (!product) {
    return null;
  }

  try {
    await marketplaceRepository.deleteProduct(sku);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the sku is registered
 * @param {string} sku - Product Sku
 * @returns {boolean}
 */
async function skuIsRegistered(sku) {
  const product = await marketplaceRepository.getProductBySku(sku);

  if (product) {
    return true;
  }

  return false;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  skuIsRegistered,
};
