const purchasesRepository = require('./purchases-repository');

/**
 * List all user purchases with search, sort, and pagination
 * @param {String} search
 * @param {String} sortField
 * @param {String} sortOrder
 * @param {Number} page_number
 * @param {Number} page_size
 * @returns {Promise}
 */
async function getPurchases(
  search,
  sortField,
  sortOrder,
  page_number,
  page_size
) {
  const searchString = typeof search === 'string' ? search.toLowerCase() : '';

  const purchases = await purchasesRepository.getPurchasesList(); // Fetch all purchases data from database

  let filteredPurchases = purchases;

  // Fungsi Search
  if (searchString) {
    filteredPurchases = filteredPurchases.filter(
      (purchase) =>
        purchase.name.toLowerCase().includes(searchString) ||
        purchase.email.toLowerCase().includes(searchString) ||
        purchase.address.toLowerCase().includes(searchString)
    );
  }

  // Fungsi Sort
  filteredPurchases.sort((a, b) => {
    const aField = a?.[sortField]?.toLowerCase() || '';
    const bField = b?.[sortField]?.toLowerCase() || '';

    // Sort berdasarkan sortOrder sesuai query
    if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
    if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Fungsi Pagination
  const total_pages = Math.ceil(purchases.length / page_size);
  const count = purchases.length;
  const has_previous_page = page_number > 1;
  const has_next_page = page_number < total_pages;

  // Declaring purchaseData schema
  const purchaseData = filteredPurchases.map((purchase) => ({
    id: purchase.id,
    name: purchase.name,
    email: purchase.email,
    address: purchase.address,
    itemsArr: purchase.itemsArr,
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
      data: purchaseData,
    };
  } else {
    // Melakukan pagination sesuai query page_number dan page_size
    const offset = (page_number - 1) * page_size;
    const paginatedList = purchaseData.slice(offset, offset + page_size);

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
 * Get specific purchase detail by user purchase id
 * @param {String} id - User Purchase Id
 * @returns {Promise}
 */
async function getPurchaseDetail(id) {
  const purchase = await purchasesRepository.getPurchaseList(id);

  // Purchase Entry not found
  if (!purchase) {
    return null;
  }

  return {
    id: purchase.id,
    name: purchase.name,
    email: purchase.email,
    address: purchase.address,
    itemsArr: purchase.itemsArr, // Array of products from purchase entry database
  };
}

/**
 * Create a new purchase entry
 * @param {String} name
 * @param {String} email
 * @param {Object} address
 * @returns {Promise}
 */
async function createPurchaseEntry(name, email, address) {
  try {
    const newPurchase = await purchasesRepository.createPurchaseEntry(
      name,
      email,
      address
    );
    return newPurchase;
  } catch (err) {
    console.error('Error creating purchase:', err);
    return null;
  }
}

/**
 * Add product to purchase entry by purchase entry id
 * @param {String} id - User Purchase Id
 * @param {String} productSku - Product Sku
 * @returns {Promise}
 */
async function addProductToPurchase(id, productSku) {
  try {
    const updatedPurchase = await purchasesRepository.updatePurchaseEntry(
      id,
      productSku
    );
    if (!updatedPurchase) {
      throw new Error('Failed to update purchase entry in the database');
    }
    return updatedPurchase;
  } catch (err) {
    console.error('Error updating purchase:', err);
    throw err;
  }
}

/**
 * Delete product from purchase entry by purchase entry id
 * @param {String} id - User Purchase Id
 * @param {String} productSku - Product Sku
 * @returns {Promise}
 */
async function deleteProductFromPurchase(id, productSku) {
  try {
    const updatedPurchase = await purchasesRepository.deletePurchaseEntry(
      id,
      productSku
    ); // Delete product from purchase entry
    return updatedPurchase;
  } catch (err) {
    console.error('Error deleting product from purchase:', err);
    return null;
  }
}

module.exports = {
  getPurchases,
  getPurchaseDetail,
  createPurchaseEntry,
  addProductToPurchase,
  deleteProductFromPurchase,
};
