const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const purchasesControllers = require('./purchases-controller');
const purchasesValidator = require('./purchases-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/purchases', route);

  // Fetching list of purchases
  route.get(
    '/',
    authenticationMiddleware,
    purchasesControllers.getPurchasesList
  );

  // Fetching purchase details by ID
  route.get(
    '/:id',
    authenticationMiddleware,
    purchasesControllers.getPurchaseDetail
  );

  // Creating a new purchase entry
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(purchasesValidator.createPurchaseEntry),
    purchasesControllers.createPurchaseEntry
  );

  // Adding product to purchase by id
  route.put(
    '/add-product',
    authenticationMiddleware,
    purchasesControllers.addProductToPurchase
  );

  // Deleting product from purchase by id
  route.delete(
    '/remove-product',
    authenticationMiddleware,
    purchasesControllers.deleteProductFromPurchase
  );
};
