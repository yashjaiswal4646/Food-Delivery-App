const Cart = require('../models/Cart');
const Food = require('../models/Food');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        console.log('📦 GET CART - User:', req.user?._id || req.user?.id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const userId = req.user._id || req.user.id;
        let cart = await Cart.findOne({ user: userId }).populate('items.food');
        
        if (!cart) {
            console.log('Creating new cart for user:', userId);
            cart = new Cart({
                user: userId,
                items: [],
                totalPrice: 0,
                totalItems: 0
            });
            await cart.save();
        }
        
        console.log('Cart found/created. Items:', cart.items.length);
        
        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('❌ Get cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    try {
        console.log('📦 ADD TO CART - Request received');
        console.log('User:', req.user?._id || req.user?.id);
        console.log('Body:', req.body);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const { foodId, quantity = 1 } = req.body;
        const userId = req.user._id || req.user.id;
        
        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: 'Food ID is required'
            });
        }
        
        // Check if food exists
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food not found'
            });
        }
        
        console.log('Food found:', food.name);
        
        // Find or create cart
        let cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            console.log('Creating new cart for user');
            cart = new Cart({
                user: userId,
                items: [],
                totalPrice: 0,
                totalItems: 0
            });
        }
        
        // Check if item already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.food.toString() === foodId
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            console.log('Item exists, updating quantity');
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            console.log('Adding new item to cart');
            cart.items.push({
                food: foodId,
                name: food.name,
                price: food.price,
                image: food.image,
                quantity
            });
        }
        
        // Recalculate totals
        cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        await cart.save();
        console.log('Cart saved. Total items:', cart.totalItems);
        
        // Populate food details before sending response
        await cart.populate('items.food');
        
        res.status(200).json({
            success: true,
            cart
        });
        
    } catch (error) {
        console.error('❌ Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        console.log('📦 UPDATE CART - Request received');
        console.log('User:', req.user?._id || req.user?.id);
        console.log('Params:', req.params);
        console.log('Body:', req.body);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const { quantity } = req.body;
        const { itemId } = req.params;
        const userId = req.user._id || req.user.id;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }
        
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        // Find item in cart
        const itemIndex = cart.items.findIndex(
            item => item._id.toString() === itemId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }
        
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
        
        // Recalculate totals
        cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        await cart.save();
        
        // Populate food details
        await cart.populate('items.food');
        
        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('❌ Update cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        console.log('📦 REMOVE FROM CART - Request received');
        console.log('User:', req.user?._id || req.user?.id);
        console.log('Params:', req.params);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const { itemId } = req.params;
        const userId = req.user._id || req.user.id;

        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        // Remove item
        cart.items = cart.items.filter(
            item => item._id.toString() !== itemId
        );
        
        // Recalculate totals
        cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        await cart.save();
        
        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('❌ Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
    try {
        console.log('📦 CLEAR CART - Request received');
        console.log('User:', req.user?._id || req.user?.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const userId = req.user._id || req.user.id;

        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
        
        cart.items = [];
        cart.totalItems = 0;
        cart.totalPrice = 0;
        
        await cart.save();
        
        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cart
        });
    } catch (error) {
        console.error('❌ Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export all functions at the bottom
module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};