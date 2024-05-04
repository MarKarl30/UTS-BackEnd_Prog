const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get users after search, sort and pagination
 * @param {String} search
 * @param {String} sortField
 * @param {String} sortOrder
 * @param {String} page_number
 * @param {String} page_size
 * @returns
 */
async function getUsers(search, sortField, sortOrder, page_number, page_size) {
  // Cek parameter search adalah string dan mengubah search ke bentuk lowercase
  const searchString = typeof search === 'string' ? search.toLowerCase() : '';

  const users = await usersRepository.getUsers();
  let filteredUsers = users;

  // Fungsi Search
  // Search berdasarkan parameter searchString kepada data name dan email
  if (searchString) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user?.name?.toLowerCase().includes(searchString) || // Validasi sebelum memanggil toLowerCase
        user?.email?.toLowerCase().includes(searchString)
    );
  }

  // Fungsi Sort
  // Sort berdasarkan sortField sesuai query
  filteredUsers.sort((a, b) => {
    const aField = a?.[sortField]?.toLowerCase() || ''; // Default ke string kosong jika null atau undefined
    const bField = b?.[sortField]?.toLowerCase() || '';

    // Sort berdasarkan sortOrder sesuai query
    if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
    if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Fungsi Pagination
  // Pagination berdasarkan query page_size dan page_nmumber
  const total_pages = Math.ceil(users.length / page_size);
  const count = users.length;
  const has_previous_page = page_number > 1;
  const has_next_page = page_number < total_pages;

  // Menetapkan schema data userData yang aka di output sebagai hasil
  const userData = filteredUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  // Jika value dari query page_number atau page_size null maka fetch all data
  if (!page_number || !page_size) {
    return {
      page_number,
      page_size,
      count,
      total_pages,
      has_previous_page,
      has_next_page,
      data: userData,
    };
  } else {
    // Melakukan pagination sesuai query page_number dan page_size
    const offset = (page_number - 1) * page_size;
    const paginatedList = userData.slice(offset, offset + page_size);

    return {
      page_number,
      page_size,
      count,
      total_pages,
      has_previous_page,
      has_next_page,
      data: paginatedList,
    };
  }
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password, loginAttempt, loginTimeout) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(
      name,
      email,
      hashedPassword,
      loginAttempt,
      loginTimeout
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
