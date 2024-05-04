const productsService = require('./products-service');
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
      result = await productsService.getProducts();
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
 * @param {object}request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await productsService.getProduct(request.params.id);

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

    // Product Name must be unique
    const nameIsRegistered =
      await productsService.nameIsRegistered(product_name);
    if (nameIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Product is already registered'
      );
    }

    const success = await productsService.createProduct(
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
    const id = request.params.id;
    const product_name = request.body.product_name;
    const brand = request.body.brand;
    const price = request.body.price;
    const category = request.body.category;

    // Product Name must be unique
    const nameIsRegistered =
      await productsService.nameIsRegistered(product_name);
    if (nameIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Product is already registered'
      );
    }

    const success = await productsService.updateProduct(
      id,
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

    return response.status(200).json({ id });
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
    const id = request.params.id;

    const success = await productsService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product entry'
      );
    }

    return response.status(200).json({ id });
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
