const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const productsControllers = require('./products-controller');
const productsValidator = require('./products-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/products', route);

  // Get list of Products
  route.get('/', authenticationMiddleware, productsControllers.getProducts);

  // Create Product entry
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(productsValidator.createProduct),
    productsControllers.createProduct
  );

  // Get Product detail
  route.get('/:id', authenticationMiddleware, productsControllers.getProduct);

  // Update Product entry
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(productsValidator.updateProduct),
    productsControllers.updateProduct
  );

  // Delete Product
  route.delete(
    '/:id',
    authenticationMiddleware,
    productsControllers.deleteProduct
  );
};
