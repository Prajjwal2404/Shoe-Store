const express = require('express');
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/me/cart', cartController.getCart);
router.post('/me/cart', cartController.addToCart);
router.put('/me/cart/:productId', cartController.updateCartItem);
router.delete('/me/cart/:productId', cartController.removeCartItem);
router.delete('/me/cart', cartController.clearCart);

module.exports = router;
