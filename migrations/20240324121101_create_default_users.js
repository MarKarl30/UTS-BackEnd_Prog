const logger = require('../src/core/logger')('api');
const { User } = require('../src/models');
const { Product } = require('../src/models');
const { hashPassword } = require('../src/utils/password');

const name = 'Administrator';
const email = 'admin@example.com';
const password = '123456';

logger.info('Creating default users');

(async () => {
  try {
    const numUsers = await User.countDocuments({
      name,
      email,
    });

    if (numUsers > 0) {
      throw new Error(`User ${email} already exists`);
    }

    const hashedPassword = await hashPassword(password);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();

const product_name = 'Product';
const brand = 'Example Brand';
const price = '10000';
const category = 'Example Category';

logger.info('Creating default products');

(async () => {
  try {
    const numProducts = await Product.countDocuments({
      product_name,
      brand,
      price,
      category,
    });

    if (numProducts > 0) {
      throw new Error(`Product ${product_name} already exists`);
    }

    await Product.create({
      product_name,
      brand,
      price,
      category,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();
