const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide food name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide food description']
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide category']
    },
    image: {
        type: String,
        required: [true, 'Please provide food image']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isVegetarian: {
        type: Boolean,
        default: false
    },
    preparationTime: {
        type: Number,
        required: [true, 'Please provide preparation time in minutes']
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Update rating when review is added
foodSchema.methods.calculateRating = function() {
    if (this.reviews.length === 0) {
        this.rating = 0;
        this.numReviews = 0;
    } else {
        const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
        this.rating = sum / this.reviews.length;
        this.numReviews = this.reviews.length;
    }
};

module.exports = mongoose.model('Food', foodSchema);