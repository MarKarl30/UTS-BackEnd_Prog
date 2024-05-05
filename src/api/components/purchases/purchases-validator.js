const joi = require('joi');

module.exports = {
  createPurchaseEntry: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().min(1).max(100).required().label('Email'),
      address: joi.string().min(1).max(100).required().label('Address'),
    },
  },

  deleteProductFromPurchase: {
    body: {
      productId: joi.string().length(24).required().label('Product ID'), // Validasi ID produk yang ingin dihapus
    },
  },
};
