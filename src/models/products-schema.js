const productsSchema = {
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  product_name: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
};

module.exports = productsSchema;
