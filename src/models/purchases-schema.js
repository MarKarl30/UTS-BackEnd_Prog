const mongoose = require('mongoose');
const Product = require('./index');

const purchasesSchema = {
  name: String,
  email: String,
  address: String,
  itemArr: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
};

module.exports = purchasesSchema;
