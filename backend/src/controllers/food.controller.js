const Food = require('../models/Food');
const Category = require('../models/Category');

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
exports.getFoods = async (req, res, next) => {
    try {
        const { category, search, minPrice, maxPrice, isVegetarian, sort } = req.query;
        
        // Build query
        let query = { isAvailable: true };
        
        if (category) {
            query.category = category;
        }
        
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
        if (isVegetarian) {
            query.isVegetarian = isVegetarian === 'true';
        }
        
        // Sort options
        let sortOption = { createdAt: -1 };
        if (sort === 'price-low') {
            sortOption = { price: 1 };
        } else if (sort === 'price-high') {
            sortOption = { price: -1 };
        } else if (sort === 'rating') {
            sortOption = { rating: -1 };
        }
        
        const foods = await Food.find(query)
            .populate('category', 'name')
            .sort(sortOption);
        
        res.status(200).json({
            success: true,
            count: foods.length,
            foods
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
exports.getFood = async (req, res, next) => {
    try {
        const food = await Food.findById(req.params.id).populate('category', 'name');
        
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food not found'
            });
        }
        
        res.status(200).json({
            success: true,
            food
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create food
// @route   POST /api/foods
// @access  Private/Admin
exports.createFood = async (req, res, next) => {
    try {
        // Check if category exists
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        // Add image if uploaded
        if (req.file) {
            req.body.image = req.file.path;
        }
        
        const food = await Food.create(req.body);
        
        res.status(201).json({
            success: true,
            food
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update food
// @route   PUT /api/foods/:id
// @access  Private/Admin
exports.updateFood = async (req, res, next) => {
    try {
        let food = await Food.findById(req.params.id);
        
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food not found'
            });
        }
        
        // Update image if uploaded
        if (req.file) {
            req.body.image = req.file.path;
        }
        
        food = await Food.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            food
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Private/Admin
exports.deleteFood = async (req, res, next) => {
    try {
        const food = await Food.findById(req.params.id);
        
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food not found'
            });
        }
        
        await food.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Food deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get foods by category
// @route   GET /api/foods/category/:categoryId
// @access  Public
exports.getFoodsByCategory = async (req, res, next) => {
    try {
        const foods = await Food.find({
            category: req.params.categoryId,
            isAvailable: true
        }).populate('category', 'name');
        
        res.status(200).json({
            success: true,
            count: foods.length,
            foods
        });
    } catch (error) {
        next(error);
    }
};