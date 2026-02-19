const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getUsers,
    toggleUserBlock,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle-block', toggleUserBlock);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;