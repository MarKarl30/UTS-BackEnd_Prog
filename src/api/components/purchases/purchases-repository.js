const { Purchase } = require('../../../models');
const productsRepository = require('../products/products-repository');

/**
 * List all users with their saved purchased items
 * @returns {Promise}
 */
async function getPurchasesList() {
  return Purchase.find({});
}

/**
 * Get specific user purchase details
 * @param {string} id - User Purchase Id
 * @returns {Promise}
 */
async function getPurchaseList(id) {
  return Purchase.findById(id).populate('itemsArr');
}

/**
 * Create a new user purchase entry
 * @param {String} name
 * @param {String} email
 * @param {String} address
 * @returns
 */
async function createPurchaseEntry(name, email, address) {
  return Purchase.create({
    name,
    email,
    address,
  });
}

/**
 * Update existing user purchase entry
 * By filling itemsArr with Products
 * @param {String} id - User Purchase Id
 * @param {String} productSku - Product Sku
 * @returns {Promise}
 */
async function updatePurchaseEntry(id, productSku) {
  const product = await productsRepository.getProduct(productSku);
  if (!product) {
    throw new Error(`Product with SKU ${productSku} not found`);
  }

  return Purchase.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $push: {
        itemsArr: product,
      },
    },
    {
      new: true,
    }
  ).populate('itemsArr');
}

/**
 * Delete a product entry in user purchase list
 * @param {string} id - User Purchase Id
 * @param {string} productSku - Product Id
 * @returns {Promise}
 */
async function deletePurchaseEntry(id, productSku) {
  const product = await productsRepository.getProducts(productSku);
  if (!product) {
    throw new Error(`Product with SKU ${productSku} not found`);
  }

  return Purchase.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $pull: {
        itemsArr: { sku: productSku },
      },
    },
    {
      new: true,
    }
  ).populate('itemsArr');
}

module.exports = {
  getPurchasesList,
  getPurchaseList,
  createPurchaseEntry,
  updatePurchaseEntry,
  deletePurchaseEntry,
};
