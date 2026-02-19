const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrder,
    updateOrderToPaid,
    cancelOrder
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth');

// All order routes require authentication
router.use(protect);

// IMPORTANT: Define specific routes BEFORE parameterized routes
// Get logged in user's orders - this must come BEFORE /:id
router.get('/myorders', getMyOrders);

// Create new order
router.post('/', createOrder);

// Routes with parameters - these come AFTER specific routes
router.get('/:id', getOrder);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/cancel', cancelOrder);

module.exports = router;