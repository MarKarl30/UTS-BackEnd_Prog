const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const authenticationRepository = require('./authentication-repository');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Get the current login attempt count from the database
    const user = await authenticationRepository.getUserByEmail(email);
    let loginAttempt = user.loginAttempt || 0;

    if (loginAttempt >= 5) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts'
      );
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Increment and update the login attempt count in the database
      loginAttempt += 1;
      await authenticationRepository.updateLoginAttempt(loginAttempt, email);

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    // If login is successful, reset the login attempt count to zero
    await authenticationRepository.updateLoginAttempt(0, email);

    return response.status(200).json({ loginSuccess });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
