const express = require('express');
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', authenticateToken, productController.updateTotalReviews);

router.get('/:id/reviews', productController.getProductReviews);
router.post('/:id/reviews', authenticateToken, productController.addProductReview);

module.exports = router;
