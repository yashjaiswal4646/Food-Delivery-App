const Food = require('../models/Food');
const Order = require('../models/Order');

// @desc    Create a new review
// @route   POST /api/foods/:id/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const foodId = req.params.id;

    // Check if user has ordered this food
    const orders = await Order.find({
      user: req.user.id,
      orderStatus: 'delivered',
      'orderItems.food': foodId
    });

    if (orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'You can only review food items you have ordered and received'
      });
    }

    // Find the food
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    // Check if user already reviewed this food
    const alreadyReviewed = food.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this food'
      });
    }

    // Create review
    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: Date.now()
    };

    food.reviews.push(review);
    
    // Update rating
    const totalRating = food.reviews.reduce((sum, item) => sum + item.rating, 0);
    food.rating = totalRating / food.reviews.length;
    food.numReviews = food.reviews.length;

    await food.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review,
      foodRating: food.rating,
      numReviews: food.numReviews
    });

  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get reviews for a food
// @route   GET /api/foods/:id/reviews
// @access  Public
exports.getFoodReviews = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .select('reviews rating numReviews')
      .populate('reviews.user', 'name');

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.json({
      success: true,
      reviews: food.reviews,
      rating: food.rating,
      numReviews: food.numReviews
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if user can review a food
// @route   GET /api/foods/:id/can-review
// @access  Private
exports.canReview = async (req, res) => {
  try {
    const foodId = req.params.id;

    // Check if user has ordered this food
    const orders = await Order.find({
      user: req.user.id,
      orderStatus: 'delivered',
      'orderItems.food': foodId
    });

    const canReview = orders.length > 0;

    // Check if already reviewed
    const food = await Food.findById(foodId);
    const alreadyReviewed = food?.reviews.find(
      review => review.user.toString() === req.user.id
    );

    res.json({
      success: true,
      canReview: canReview && !alreadyReviewed,
      alreadyReviewed: !!alreadyReviewed,
      hasOrdered: canReview
    });

  } catch (error) {
    console.error('Can review error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};