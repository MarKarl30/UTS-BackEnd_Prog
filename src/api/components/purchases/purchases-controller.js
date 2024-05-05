const purchasesService = require('./purchases-service');
const { errorResponder, errorTypes } = require('../../../core/errors'); // Pastikan ini benar-benar ada dan diatur dengan benar

/**
 * Get a list of purchases with search, sort, and pagination
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express middleware
 * @returns {Promise<Object>} The response object or passes an error to the next middleware
 */
async function getPurchasesList(request, response, next) {
  try {
    const page_number = request.query.page_number
      ? parseInt(request.query.page_number, 10)
      : 1; // Default page number
    const page_size = request.query.page_size
      ? parseInt(request.query.page_size, 10)
      : 10; // Default page size
    const search = request.query.search || ''; // Search term
    const sortField = request.query.sortField || 'email'; // Default sort field
    const sortOrder = request.query.sortOrder || 'asc'; // Default sort order

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
    return next(error); // Pass error to the next middleware
  }
}

/**
 * Get specific purchase details by email
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express middleware
 * @returns {Promise<Object|null>} The purchase detail or passes an error
 */
async function getPurchaseDetail(request, response, next) {
  try {
    const email = request.params.email; // Get email from request parameters
    const purchase = await purchasesService.getPurchaseDetail(email);

    if (!purchase) {
      throw errorResponder(
        errorTypes.NOT_FOUND,
        'Purchase not found with given email'
      ); // Custom error handling
    }

    return response.status(200).json(purchase); // Return the purchase details
  } catch (error) {
    console.error('Error fetching purchase detail:', error);
    return next(error);
  }
}

/**
 * Create a new purchase entry
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express middleware
 * @returns {Promise<Object>} The response object or passes an error
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
      ); // Error handling for creation failure
    }

    return response.status(201).json(newPurchase); // Status 201 for successful creation
  } catch (error) {
    console.error('Error creating purchase entry:', error);
    return next(error);
  }
}

/**
 * Update purchase entry with new product
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express middleware
 * @returns {Promise<Object|null>} The response object or passes an error
 */
async function addProductToPurchase(request, response, next) {
  try {
    const email = request.params.email; // Get email from the request parameter
    const productId = request.body.productId; // Get the product ID to be added

    const updatedPurchase = await purchasesService.addProductToPurchase(
      email,
      productId
    );

    if (!updatedPurchase) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to add product to purchase'
      );
    }

    return response.status(200).json(updatedPurchase); // Return the updated purchase
  } catch (error) {
    console.error('Error adding product to purchase:', error);
    return next(error); // Pass error to the next middleware
  }
}

/**
 * Delete a product from a purchase by email and product ID
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express middleware
 * @returns {Promise<Object|null>} The response object or passes an error
 */
async function deleteProductFromPurchase(request, response, next) {
  try {
    const email = request.params.email; // Get email from the request parameter
    const productId = request.body.productId; // Get the product ID to be deleted

    const updatedPurchase = await purchasesService.deleteProductFromPurchase(
      email,
      productId
    );

    if (!updatedPurchase) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product from purchase'
      );
    }

    return response.status(200).json(updatedPurchase); // Return the updated purchase
  } catch (error) {
    console.error('Error deleting product from purchase:', error);
    return next(error); // Pass error to the next middleware
  }
}

module.exports = {
  getPurchasesList,
  getPurchaseDetail,
  createPurchaseEntry,
  addProductToPurchase,
  deleteProductFromPurchase,
};
