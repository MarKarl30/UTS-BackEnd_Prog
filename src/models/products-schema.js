const productsSchema = {
  sku: {
    type: String,
    required: true,
    unique: true, // Ensure SKU is unique
    trim: true, // Remove leading/trailing whitespace
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
    min: 0, // Ensure price is non-negative
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
};

module.exports = productsSchema;
