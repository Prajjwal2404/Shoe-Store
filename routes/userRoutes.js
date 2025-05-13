const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/me', userController.getUserProfile);

router.get('/me/addresses', userController.getUserAddresses);
router.post('/me/addresses', userController.addUserAddress);
router.put('/me/addresses/:addressId', userController.updateUserAddress);
router.delete('/me/addresses/:addressId', userController.deleteUserAddress);

router.get('/me/wishlist', userController.getUserWishlist);
router.post('/me/wishlist', userController.addToWishlist);
router.delete('/me/wishlist/:productId', userController.removeFromWishlist);

module.exports = router;
