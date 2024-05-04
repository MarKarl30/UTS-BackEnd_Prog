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
 * @param {string} id - Product Id
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
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
 * @param {String} id - Product Id
 * @param {String} product_name
 * @param {String} brand
 * @param {String} price
 * @param {String} category
 * @returns
 */
async function updateProduct(id, product_name, brand, price, category) {
  return Product.updateOne(
    {
      _id: id,
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
 * @param {string} id - Product Id
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

/**
 * Get product by id to prevent duplicate product
 * @param {string} id - Product Id
 * @returns {Promise}
 */
async function getProductById(id) {
  return Product.findById({ id });
}

/**
 *
 * @param {string} product_name
 * @returns
 */
async function getProductByName(product_name) {
  return Product.findOne({ product_name });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductByName,
};
