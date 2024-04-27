const { Product } = require('../../../models');

/**
 * Get a list of products
 * @returns {Promise}
 */
async function getProducts() {
  return Product.find({});
}

/**
 * Get product detail
 * @param {string} sku - Product SKU
 * @returns {Promise}
 */
async function getProduct(sku) {
  return Product.findById(sku);
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
  return Product.create({
    product_name,
    brand,
    price,
    category,
  });
}

/**
 * Update existing product
 * @param {String} sku - Product SKU
 * @param {String} product_name
 * @param {String} brand
 * @param {String} price
 * @param {String} category
 * @returns
 */
async function updateProduct(sku, product_name, brand, price, category) {
  return Product.updateOne(
    {
      _sku: sku,
    },
    {
      $set: {
        product_name,
        brand,
        price,
        category,
      },
    }
  );
}

/**
 * Delete a product
 * @param {string} sku - Product SKU
 * @returns {Promise}
 */
async function deleteProduct(sku) {
  return Product.deleteOne({ _sku: sku });
}

/**
 * Get product by sku to prevent duplicate product
 * @param {string} sku - Product Sku
 * @returns {Promise}
 */
async function getProductBySku(sku) {
  return Product.findById({ sku });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySku,
};
