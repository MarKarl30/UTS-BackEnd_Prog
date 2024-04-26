const { User } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function updateLoginAttempt(loginAttempt, email) {
  return User.updateOne(
    {
      email,
    },
    {
      $set: {
        loginAttempt,
      },
    }
  );
}

module.exports = {
  getUserByEmail,
  updateLoginAttempt,
};
