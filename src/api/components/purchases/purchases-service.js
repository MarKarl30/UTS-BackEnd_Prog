const purchasesRepository = require('./purchases-repository'); // Pastikan rujukan ke file repositori benar

/**
 * Get purchases with search, sort, and pagination
 * @param {String} search
 * @param {String} sortField
 * @param {String} sortOrder
 * @param {Number} page_number
 * @param {Number} page_size
 * @returns {Promise<Object>} Paginated list of purchases
 */
async function getPurchases(
  search,
  sortField,
  sortOrder,
  page_number,
  page_size
) {
  const searchString = typeof search === 'string' ? search.toLowerCase() : '';
  const allPurchases = await purchasesRepository.getPurchasesList(); // Mengambil semua pembelian

  // Filter untuk pencarian
  let filteredPurchases = allPurchases.filter(
    (purchase) =>
      purchase.name.toLowerCase().includes(searchString) ||
      purchase.email.toLowerCase().includes(searchString) ||
      purchase.address.street.toLowerCase().includes(searchString) // Contoh, sesuaikan dengan skema address Anda
  );

  // Sorting
  filteredPurchases.sort((a, b) => {
    const aField = a?.[sortField]?.toLowerCase() || '';
    const bField = b?.[sortField]?.toLowerCase() || '';

    if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
    if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const offset = (page_number - 1) * page_size;
  const paginatedPurchases = filteredPurchases.slice(
    offset,
    offset + page_size
  );

  return {
    page_number,
    page_size,
    total_pages: Math.ceil(filteredPurchases.length / page_size),
    data: paginatedPurchases,
  };
}

/**
 * Get specific purchase detail by email
 * @param {String} email - User email
 * @returns {Promise<Object|null>} The purchase detail or null if not found
 */
async function getPurchaseDetail(email) {
  const purchase = await purchasesRepository.getPurchaseList(email); // Ambil pembelian berdasarkan email

  if (!purchase) {
    return null; // Jika tidak ditemukan
  }

  return {
    name: purchase.name,
    email: purchase.email,
    address: purchase.address,
    itemsArr: purchase.itemsArr, // Pastikan mengembalikan semua data yang diperlukan
  };
}

/**
 * Create a new purchase entry
 * @param {String} name
 * @param {String} email
 * @param {Object} address
 * @returns {Promise<Object>} The created purchase entry
 */
async function createPurchaseEntry(name, email, address) {
  try {
    const newPurchase = await purchasesRepository.createPurchaseEntry(
      name,
      email,
      address
    ); // Membuat pembelian baru
    return newPurchase;
  } catch (err) {
    console.error('Error creating purchase:', err);
    return null;
  }
}

/**
 * Add product to purchase by email
 * @param {String} email - User email
 * @param {String} productId - Product ID
 * @returns {Promise<Object|null>} The updated purchase or null if error occurs
 */
async function addProductToPurchase(email, productId) {
  try {
    const updatedPurchase = await purchasesRepository.updatePurchaseEntry(
      email,
      productId
    ); // Menambahkan produk ke pembelian
    return updatedPurchase;
  } catch (err) {
    console.error('Error updating purchase:', err);
    return null;
  }
}

/**
 * Delete product from purchase by email
 * @param {String} email - User email
 * @param {String} productId - Product ID
 * @returns {Promise<Object|null>} The updated purchase or null if error occurs
 */
async function deleteProductFromPurchase(email, productId) {
  try {
    const updatedPurchase = await purchasesRepository.deletePurchaseEntry(
      email,
      productId
    ); // Menghapus produk dari pembelian
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
