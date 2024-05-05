const { Product } = require('../../../models');

/**
 * Get a list of products
 * @returns {Promise}
 */
async function getProducts() {
  return Product.find({});
}

/**
 * Get product detail by SKU
 * @param {string} sku - Product SKU Id
 * @returns {Promise}
 */
async function getProduct(sku) {
  return Product.findOne({ sku }); // Corrected parameter structure
}

/**
 * Create new product
 * @param {Object} product - Product data to create
 * @returns {Promise}
 */
async function createProduct(product) {
  return Product.create(product); // Create product with given data
}

/**
 * Update existing product by SKU
 * @param {String} sku - Product SKU Id
 * @param {Object} updateData - Data to update
 * @returns {Promise}
 */
async function updateProduct(sku, updateData) {
  return Product.findOneAndUpdate({ sku }, { $set: updateData }, { new: true }); // Corrected the typo and added 'new: true' to return updated document
}

/**
 * Delete a product by SKU
 * @param {string} sku - Product SKU Id
 * @returns {Promise}
 */
async function deleteProduct(sku) {
  return Product.findOneAndDelete({ sku });
}

/**
 * Get product by SKU id to prevent duplicate product
 * @param {string} sku - Product SKU Id
 * @returns {Promise}
 */
async function getProductBySku(sku) {
  return Product.findOne({ sku }); // Ensures correct field-based query
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySku,
};
