const User = require('../models/User');
const Order = require('../models/Order');
const Food = require('../models/Food');
const Category = require('../models/Category');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Get counts
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalOrders = await Order.countDocuments();
        const totalFoods = await Food.countDocuments();
        const totalCategories = await Category.countDocuments();
        
        // Get revenue
        const orders = await Order.find({ orderStatus: 'delivered' });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        
        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name')
            .sort('-createdAt')
            .limit(5);
        
        // Get popular foods
        const popularFoods = await Order.aggregate([
            { $unwind: '$orderItems' },
            { $group: {
                _id: '$orderItems.food',
                count: { $sum: '$orderItems.quantity' },
                name: { $first: '$orderItems.name' }
            }},
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalOrders,
                totalFoods,
                totalCategories,
                totalRevenue,
                recentOrders,
                popularFoods
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/toggle-block
// @access  Private/Admin
exports.toggleUserBlock = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        if (user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot block admin users'
            });
        }
        
        user.isBlocked = !user.isBlocked;
        await user.save();
        
        res.status(200).json({
            success: true,
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('orderItems.food', 'name')
            .sort('-createdAt');
        
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        order.orderStatus = status;
        
        if (status === 'delivered') {
            order.deliveredAt = Date.now();
        }
        
        await order.save();
        
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(error);
    }
};