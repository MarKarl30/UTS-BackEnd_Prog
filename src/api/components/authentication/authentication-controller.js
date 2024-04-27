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
    // Initialize loginAttempt and lastAttempt var
    let loginAttempt = user.loginAttempt || 0;
    let lastAttempt = new Date(user.lastAttempt) || null;

    // Initialize currentTime and currTime var
    currentTime = new Date(); // currentTime value that will be updated everytime user do login
    currTime = new Date(currentTime).getTime(); // curretTime in milliseconds to compare with lockoutEndTime

    // Initialize lockedOutMs and lockedoutEndTime var
    const lockedOutMs = 2 * 60 * 1000; // 30 minutes in milliseconds
    const lockoutEndTime = new Date(lastAttempt).getTime() + lockedOutMs;

    // Reset loginAttempt at DB if the lockout time has passed
    if (currTime >= lockoutEndTime && loginAttempt > 5) {
      await authenticationRepository.updateLoginAttempt(0, currentTime, email);
      loginAttempt = 0;
    }

    // If user failed to login 5 times, Do lockout on user account (email)
    if (user.loginAttempt >= 5 && currentTime - lastAttempt < lockedOutMs) {
      // Calculate remaining lockout time
      const remainingLockoutTime = Math.ceil(
        (lockoutEndTime - currentTime.getTime()) / 60000
      );

      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts, Try again in ' +
          remainingLockoutTime +
          ' minute(s)'
      );
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    // If user fails to login
    if (!loginSuccess) {
      // Increment and update the login attempt count in the database by 1
      loginAttempt += 1;
      await authenticationRepository.updateLoginAttempt(
        loginAttempt,
        currentTime,
        email
      );

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    // If login is successful, reset the login attempt count to 0
    await authenticationRepository.updateLoginAttempt(0, currentTime, email);

    return response.status(200).json({ loginSuccess });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
