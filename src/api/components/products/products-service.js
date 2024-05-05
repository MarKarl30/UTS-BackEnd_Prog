const productsRepository = require('./products-repository');

/**
 * Get users after search, sort and pagination
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

  const products = await productsRepository.getProducts();
  let filteredProducts = products;

  // Fungsi Search
  // Search berdasarkan parameter searchString kepada data name dan email
  if (searchString) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product?.product_name?.toLowerCase().includes(searchString) || // Validasi sebelum memanggil toLowerCase
        product?.brand?.toLowerCase().includes(searchString) ||
        product?.category?.toLowerCase().includes(searchString)
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

  // Menetapkan schema data userData yang aka di output sebagai hasil
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
 * Get product detail by SKU
 * @param {String} sku - Product SKU Id
 * @returns {Object}
 */
async function getProduct(sku) {
  const product = await productsRepository.getProduct(sku);

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
 * @param {Object} productData - Product data to create
 * @returns {Boolean}
 */
async function createProduct(sku, product_name, brand, price, category) {
  function generateSkuId(minLength = 6, maxLength = 12) {
    const charPool =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const skuLength =
      Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    let skuId = '';
    for (let i = 0; i < skuLength; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      skuId += charPool[randomIndex];
    }

    return skuId;
  }

  try {
    // Ensure unique SKU generation
    const randSku = sku || generateSkuId(); // Fallback to generated SKU if not provided

    if (await skuIsRegistered(randSku)) {
      throw new Error('SKU already registered');
    }

    await productsRepository.createProduct({
      sku: randSku,
      product_name,
      brand,
      price,
      category,
    });

    return true;
  } catch (err) {
    console.error('Error creating product:', err);
    return false; // Return false on failure
  }
}

/**
 * Update existing product by SKU
 * @param {String} sku - Product SKU Id
 * @param {String} product_name
 * @param {String} brand
 * @param {String} price
 * @param {String} category
 * @returns {Boolean}
 */
async function updateProduct(sku, product_name, brand, price, category) {
  const product = await productsRepository.getProduct(sku);

  if (!product) {
    return false;
  }

  try {
    await productsRepository.updateProduct(sku, {
      product_name,
      brand,
      price,
      category,
    });

    return true;
  } catch (err) {
    console.error('Error updating product:', err);
    return false; // Return false on failure
  }
}

/**
 * Delete product by SKU
 * @param {String} sku - Product SKU Id
 * @returns {Boolean}
 */
async function deleteProduct(sku) {
  const product = await productsRepository.getProduct(sku);

  if (!product) {
    return false;
  }

  try {
    await productsRepository.deleteProduct(sku);
    return true;
  } catch (err) {
    console.error('Error deleting product:', err);
    return false;
  }
}

/**
 * Check whether SKU is registered to prevent duplicate product
 * @param {String} sku - Product SKU Id
 * @returns {Boolean}
 */
async function skuIsRegistered(sku) {
  const product = await productsRepository.getProductBySku(sku);

  return !!product; // Return true if product exists
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  skuIsRegistered,
};
