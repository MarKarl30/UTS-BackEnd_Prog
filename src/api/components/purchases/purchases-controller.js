const purchasesService = require('./purchases-service');
const { errorResponder, errorTypes } = require('../../../core/errors'); // Pastikan ini benar-benar ada dan diatur dengan benar

/**
 * List all purchases entries with search, sort, and pagination
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {Promise}
 */
async function getPurchasesList(request, response, next) {
  try {
    const page_number = request.query.page_number
      ? parseInt(request.query.page_number, 10)
      : 1;
    const page_size = request.query.page_size
      ? parseInt(request.query.page_size, 10)
      : 10;
    const search = request.query.search || '';
    const sortField = request.query.sortField || 'email';
    const sortOrder = request.query.sortOrder || 'asc';

    const purchasesList = await purchasesService.getPurchases(
      search,
      sortField,
      sortOrder,
      page_number,
      page_size
    );

    return response.status(200).json(purchasesList);
  } catch (error) {
    console.error('Error fetching purchases list:', error);
    return next(error);
  }
}

/**
 * Get specific purchase details by purchase entry id
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {Promise}
 */
async function getPurchaseDetail(request, response, next) {
  try {
    const id = request.params.id; // Get id from request parameters
    const purchase = await purchasesService.getPurchaseDetail(id);

    if (!purchase) {
      throw errorResponder(
        errorTypes.NOT_FOUND,
        'Purchase entry not found with given Purchase Id'
      );
    }

    return response.status(200).json(purchase);
  } catch (error) {
    console.error('Error fetching purchase detail:', error);
    return next(error);
  }
}

/**
 * Create a new purchase entry
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {Promise}
 */
async function createPurchaseEntry(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const address = request.body.address;
    const newPurchase = await purchasesService.createPurchaseEntry(
      name,
      email,
      address
    );

    if (!newPurchase) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create purchase entry'
      );
    }

    return response.status(201).json(newPurchase);
  } catch (error) {
    console.error('Error creating purchase entry:', error);
    return next(error);
  }
}

/**
 * Update purchase entry with new product
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {Promise}
 */
async function addProductToPurchase(request, response, next) {
  try {
    const id = request.body.id; // Get id from request body
    const productSku = request.body.productSku; // Get the Product Sku to be added

    const updatedPurchase = await purchasesService.addProductToPurchase(
      id,
      productSku
    );

    if (!updatedPurchase) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to add product to purchase'
      );
    }

    return response.status(200).json(updatedPurchase); // Return the updated purchase entries
  } catch (error) {
    console.error('Error adding product to purchase:', error);
    return next(error);
  }
}

/**
 * Delete a product from a purchase by email and product ID
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {Promise}
 */
async function deleteProductFromPurchase(request, response, next) {
  try {
    const id = request.body.id; // Get id from request body
    const productSku = request.body.productSku; // Get the Product Sku to be removed

    const updatedPurchase = await purchasesService.deleteProductFromPurchase(
      id,
      productSku
    );

    if (!updatedPurchase) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product from purchase'
      );
    }

    return response.status(200).json(updatedPurchase); // Return the updated purchase entries
  } catch (error) {
    console.error('Error deleting product from purchase:', error);
    return next(error);
  }
}

module.exports = {
  getPurchasesList,
  getPurchaseDetail,
  createPurchaseEntry,
  addProductToPurchase,
  deleteProductFromPurchase,
};
