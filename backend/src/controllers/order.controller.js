const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Food = require('../models/Food');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        
        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.food');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }
        
        // Check food availability
        for (const item of cart.items) {
            const food = await Food.findById(item.food._id);
            if (!food.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: `${food.name} is not available`
                });
            }
        }
        
        // Calculate prices
        const itemsPrice = cart.totalPrice;
        const taxPrice = itemsPrice * 0.1; // 10% tax
        const deliveryPrice = itemsPrice > 500 ? 0 : 50; // Free delivery above 500
        const totalPrice = itemsPrice + taxPrice + deliveryPrice;
        
        // Create order items
        const orderItems = cart.items.map(item => ({
            food: item.food._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image
        }));
        
        // Create order
        const order = await Order.create({
            user: req.user.id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            deliveryPrice,
            totalPrice
        });
        
        // Clear cart after order
        cart.items = [];
        cart.totalItems = 0;
        cart.totalPrice = 0;
        await cart.save();
        
        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        next(error);
    }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        console.log('Getting orders for user:', req.user.id);
        
        const orders = await Order.find({ user: req.user.id })
            .populate('orderItems.food', 'name image price')
            .sort('-createdAt');
        
        console.log(`Found ${orders.length} orders`);
        
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get my orders error:', error);
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
    try {
        console.log('Getting order with ID:', req.params.id);
        
        // Check if ID is valid MongoDB ObjectId
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID format'
            });
        }
        
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('orderItems.food', 'name image price');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Check if order belongs to user or user is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }
        
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Get order error:', error);
        next(error);
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res, next) => {
    try {
        console.log('Updating order to paid:', req.params.id);
        
        // Check if ID is valid MongoDB ObjectId
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID format'
            });
        }
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };
        
        await order.save();
        
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Update order to paid error:', error);
        next(error);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
    try {
        console.log('Cancelling order:', req.params.id);
        
        // Check if ID is valid MongoDB ObjectId
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID format'
            });
        }
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Check if order belongs to user
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }
        
        // Check if order can be cancelled (only pending orders)
        if (order.orderStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
        }
        
        order.orderStatus = 'cancelled';
        await order.save();
        
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        next(error);
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || `PAID-${Date.now()}`,
      status: 'completed',
      update_time: Date.now(),
      email_address: req.user.email
    };

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Update to paid error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};