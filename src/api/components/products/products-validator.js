const joi = require('joi');

const skuPattern = /^[a-zA-Z0-9]{6,12}$/; // Pattern for SKU

module.exports = {
  createProduct: {
    body: {
      sku: joi
        .string()
        .allow('') // Allow empty strings
        .optional() // Make it optional
        .pattern(skuPattern)
        .label('SKU'),
      product_name: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Product_Name'),
      brand: joi.string().min(1).max(100).required().label('Brand'),
      price: joi.number().positive().required().label('Price'),
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
      price: joi.number().positive().required().label('Price'),
      category: joi.string().min(1).max(100).required().label('Category'),
    },
  },
};
