const joi = require('joi');

module.exports = {
  createPurchaseEntry: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().min(1).max(100).required().label('Email'),
      address: joi.string().min(1).max(100).required().label('Address'),
    },
  },

  addProductToPurchase: {
    body: {
      productSku: joi.string().length(24).required().label('Product Sku'),
    },
  },

  deleteProductFromPurchase: {
    body: {
      productSku: joi.string().length(24).required().label('Product Sku'),
    },
  },
};
