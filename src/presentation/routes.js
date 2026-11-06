const express = require('express');
const productController = require('./controllers/productController');
const orderController = require('./controllers/orderController');

module.exports = (productService, orderService) => {
  const router = express.Router();
  const products = productController(productService);
  const orders = orderController(orderService);

  router.get('/categories', products.categories);
  router.get('/products', products.list);
  router.get('/products/:id', products.detail);
  router.post('/orders', orders.create);

  // Bắt lỗi nghiệp vụ và trả về cho giao diện
  router.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || 'Lỗi hệ thống.' });
  });
  return router;
};
