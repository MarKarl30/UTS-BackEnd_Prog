const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      product_name: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Product_Name'),
      brand: joi.string().min(1).max(100).required().label('Brand'),
      price: joi.string().min(1).max(100).required().label('Price'),
      category: joi.string().min(1).max(100).required().label('Category'),
    },
  },

  updateProduct: {
    body: {
      product_name: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Product_Name'),
      brand: joi.string().min(1).max(100).required().label('Brand'),
      price: joi.string().min(1).max(100).required().label('Price'),
      category: joi.string().min(1).max(100).required().label('Category'),
    },
  },
};
