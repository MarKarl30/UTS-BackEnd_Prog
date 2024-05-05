const { Product } = require('../../../models');

/**
 * Get a list of products
 * @returns {Promise}
 */
async function getProducts() {
  return Product.find({});
}

/**
 * Get product detail by sku id
 * @param {string} sku - Product SKU Id
 * @returns {Promise}
 */
async function getProduct(sku) {
  return Product.findOne({ sku });
}

/**
 * Create new product
 * @param {Object} product
 * @returns {Promise}
 */
async function createProduct(product) {
  return Product.create(product); // Create product with queried data
}

/**
 * Update existing product by SKU
 * @param {String} sku - Product SKU Id
 * @param {Object} updateData - Data to update
 * @returns {Promise}
 */
async function updateProduct(sku, updateData) {
  return Product.findOneAndUpdate({ sku }, { $set: updateData }, { new: true });
}

/**
 * Delete a product by sku id
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
  return Product.findOne({ sku });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySku,
};
