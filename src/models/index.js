const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const productsSchema = require('./products-schema');
const purchasesSchema = require('./purchases-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const Product = mongoose.model('products', mongoose.Schema(productsSchema));
const Purchase = mongoose.model('purchases', mongoose.Schema(purchasesSchema));

module.exports = {
  mongoose,
  User,
  Product,
  Purchase,
};
