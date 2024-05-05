const express = require('express');

// Importing all routes from components
const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const products = require('./components/products/products-route');
const purchases = require('./components/purchases/purchases-route');

// Exporting all routes
module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  products(app);
  purchases(app);

  return app;
};
