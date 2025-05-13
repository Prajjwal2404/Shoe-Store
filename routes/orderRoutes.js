const express = require('express');
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/me/orders', orderController.getOrderHistory);
router.post('/me/orders', orderController.createOrder);

module.exports = router;
