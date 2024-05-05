const { Purchase } = require('../../../models');
//Product tidak di import karena sudah termasuk dalah schema Purchase

/**
 * Get a list of Users with their saved purchased items
 * @returns {Promise}
 */
async function getPurchasesList() {
  return Purchase.find({});
}

/**
 * Get specific User purchase details
 * @param {string} email - User email
 * @returns {Promise}
 */
async function getPurchaseList(email) {
  return Purchase.findOne({ email });
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
 * Update existing User Purchase Entry
 * By filling itemArr with Products
 * @param {String} email - User Email
 * @param {String} productId - Product Id
 * @returns {Promise}
 */
async function updatePurchaseEntry(email, productId) {
  return Purchase.findOneAndUpdate(
    {
      email,
    },
    {
      $push: {
        itemsArr: productId,
      },
    },
    {
      new: true,
    }
  ).populate('itemsArr');
}

/**
 * Delete a product entry in user purchase list
 * @param {string} email - User Email
 * @param {string} productId - Product Id
 * @returns {Promise}
 */
async function deletePurchaseEntry(email, productId) {
  return Purchase.findOneAndDelete(
    {
      email,
    },
    {
      $pull: {
        itemsArr: productId,
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
