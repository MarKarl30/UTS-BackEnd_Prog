const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const products = require('./components/products/products-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  products(app);

  return app;
};
