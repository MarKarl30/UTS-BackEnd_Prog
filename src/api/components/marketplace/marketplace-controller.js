const marketplaceService = require('./marketplace-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    // Fetch query dari bruno
    page_number = request.query.page_number
      ? parseInt(request.query.page_number, 10)
      : null;
    page_size = request.query.page_size
      ? parseInt(request.query.page_size, 10)
      : null;
    search = request.query.search || '';
    sortField = request.query.sortField || 'email';
    sortOrder = request.query.sortOrder || 'asc';

    let result;
    if (page_number === null || page_size === null) {
      // Jika parameter page_number atau page_size null, maka fetch semua data
      result = await marketplaceService.getProducts();
    } else {
      result = await marketplaceService.getProducts(
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
 * @param {object}request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await marketplaceService.getProduct(request.params.sku);

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
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const product_name = request.body.product_name;
    const brand = request.body.brand;
    const price = request.body.price;
    const category = request.body.category;

    // Sku must be unique
    const skuIsRegistered = await marketplaceService.skuIsRegistered(sku);
    if (skuIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Sku is already registered'
      );
    }

    const success = await marketplaceService.createProduct(
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

    return response.status(200).json({ product_name, brand, price, category });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const sku = request.params.sku;
    const product_name = request.body.product_name;
    const brand = request.body.brand;
    const price = request.body.price;
    const category = request.body.category;

    // Sku must be unique
    const skuIsRegistered = await marketplaceService.skuIsRegistered(sku);
    if (skuIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Sku is already registered'
      );
    }

    const success = await marketplaceService.updateProduct(
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
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const sku = request.params.sku;

    const success = await marketplaceService.deleteProduct(sku);
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
