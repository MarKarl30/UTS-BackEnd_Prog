const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware'); // Pastikan ini diatur dengan benar
const celebrate = require('../../../core/celebrate-wrappers');
const purchasesControllers = require('./purchases-controller'); // Pastikan rujukan ke controller benar
const purchasesValidator = require('./purchases-validator'); // Pastikan validasi ada

const route = express.Router();

module.exports = (app) => {
  app.use('/purchases', route); // Rute dasar untuk pembelian

  // Mendapatkan daftar pembelian
  route.get(
    '/',
    authenticationMiddleware,
    purchasesControllers.getPurchasesList
  ); // Menggunakan controller yang benar

  // Mendapatkan detail pembelian berdasarkan email
  route.get(
    '/:email', // Menggunakan email sebagai parameter
    authenticationMiddleware,
    purchasesControllers.getPurchaseDetail // Pastikan menggunakan fungsi controller yang benar
  );

  // Membuat entri pembelian baru
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(purchasesValidator.createPurchaseEntry), // Validasi sebelum membuat entri baru
    purchasesControllers.createPurchaseEntry // Fungsi controller yang tepat
  );

  // Menambahkan produk ke pembelian berdasarkan email
  route.put(
    '/add-product/:email', // Email sebagai parameter
    authenticationMiddleware,
    purchasesControllers.addProductToPurchase // Fungsi untuk menambahkan produk ke pembelian
  );

  // Menghapus produk dari pembelian berdasarkan email dan ID produk
  route.delete(
    '/remove-product/:email', // Email sebagai parameter
    authenticationMiddleware,
    purchasesControllers.deleteProductFromPurchase // Fungsi untuk menghapus produk dari pembelian
  );
};
