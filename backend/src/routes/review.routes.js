const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');
const {
  createReview,
  getFoodReviews,
  canReview
} = require('../controllers/review.controller');

// Public route to get reviews
router.get('/', getFoodReviews);

// Protected routes
router.post('/', protect, createReview);
router.get('/can-review', protect, canReview);

module.exports = router;