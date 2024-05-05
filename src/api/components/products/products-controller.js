const productsService = require('./products-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of products request
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {Object}
 */
async function getProducts(request, response, next) {
  try {
    const page_number = request.query.page_number
      ? parseInt(request.query.page_number, 10)
      : null;
    const page_size = request.query.page_size
      ? parseInt(request.query.page_size, 10)
      : null;
    const search = request.query.search || '';
    const sortField = request.query.sortField || 'product_name';
    const sortOrder = request.query.sortOrder || 'asc';

    let result;

    if (page_number === null || page_size === null) {
      result = await productsService.getProducts(); // Fetch all data
    } else {
      result = await productsService.getProducts(
        search,
        sortField,
        sortOrder,
        page_number,
        page_size
      );
    }

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get product detail request
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {Object}
 */
async function getProduct(request, response, next) {
  try {
    const product = await productsService.getProduct(request.params.sku);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create product request
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {Object}
 */
async function createProduct(request, response, next) {
  try {
    const sku = request.body.sku;
    const product_name = request.body.product_name;
    const brand = request.body.brand;
    const price = request.body.price;
    const category = request.body.category;

    const skuIsRegistered = await productsService.skuIsRegistered(sku);
    //Check if the SKU is already registered
    if (skuIsRegistered) {
      throw errorResponder(
        errorTypes.DB_DUPLICATE_CONFLICT,
        'Product SKU is already registered'
      );
    }

    const success = await productsService.createProduct(
      sku,
      product_name,
      brand,
      price,
      category
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product entry'
      );
    }

    return response
      .status(200)
      .json({ sku, product_name, brand, price, category });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update product request
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {Object}
 */
async function updateProduct(request, response, next) {
  try {
    //Declaring the variables
    const sku = request.params.sku;
    const product_name = request.body.product_name;
    const brand = request.body.brand;
    const price = request.body.price;
    const category = request.body.category;

    const success = await productsService.updateProduct(
      sku,
      product_name,
      brand,
      price,
      category
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product entry'
      );
    }

    return response.status(200).json({ sku });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete product request
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {Object}
 */
async function deleteProduct(request, response, next) {
  try {
    const sku = request.params.sku;

    const success = await productsService.deleteProduct(sku);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product entry'
      );
    }

    return response.status(200).json({ sku });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
