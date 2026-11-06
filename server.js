// Điểm khởi chạy: lắp ráp 3 lớp lại với nhau (Dependency Injection đơn giản)
const express = require('express');
const path = require('path');

const ProductRepository = require('./src/data/productRepository');
const OrderRepository = require('./src/data/orderRepository');
const ProductService = require('./src/business/productService');
const OrderService = require('./src/business/orderService');
const buildRoutes = require('./src/presentation/routes');

const productRepo = new ProductRepository();
const orderRepo = new OrderRepository();
const productService = new ProductService(productRepo);
const orderService = new OrderService(orderRepo, productRepo);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', buildRoutes(productService, orderService));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Cửa hàng chạy tại http://localhost:${PORT}`));
