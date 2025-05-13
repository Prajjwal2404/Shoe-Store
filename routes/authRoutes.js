const express = require('express');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/verify', authenticateToken, authController.verifyToken);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/reset', authController.requestPasswordReset);

module.exports = router;
