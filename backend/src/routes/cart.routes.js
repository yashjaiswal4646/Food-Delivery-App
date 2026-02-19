const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth');

// Log to verify controller functions are imported
console.log('=== Cart Controller Functions ===');
console.log('getCart:', typeof cartController.getCart);
console.log('addToCart:', typeof cartController.addToCart);
console.log('updateCartItem:', typeof cartController.updateCartItem);
console.log('removeFromCart:', typeof cartController.removeFromCart);
console.log('clearCart:', typeof cartController.clearCart);
console.log('=================================');

// All cart routes require authentication
router.use(protect);

// Cart routes
router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update/:itemId', cartController.updateCartItem);
router.delete('/remove/:itemId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;