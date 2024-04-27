const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const marketplaceControllers = require('./marketplace-controller');
const marketplaceValidator = require('./marketplace-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/marketplace', route);

  // Get list of products
  route.get(
    '/products',
    authenticationMiddleware,
    marketplaceControllers.getProducts
  );

  // Create purchase entry
  route.post(
    '/purchases',
    authenticationMiddleware,
    celebrate(marketplaceValidator.createProduct),
    marketplaceControllers.createProduct
  );

  // Get product detail
  route.get(
    '/products/:sku',
    authenticationMiddleware,
    marketplaceControllers.getProduct
  );

  // Update purchase
  route.put(
    '/purchases/:sku',
    authenticationMiddleware,
    celebrate(marketplaceValidator.updatePurchase),
    marketplaceControllers.updatePurchase
  );

  // Delete purchase
  route.delete(
    '/purchases/:sku',
    authenticationMiddleware,
    marketplaceControllers.deletePurchase
  );
};
