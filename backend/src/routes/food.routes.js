// const express = require('express');
// const router = express.Router();
// const {
//     getFoods,
//     getFood,
//     createFood,
//     updateFood,
//     deleteFood,
//     getFoodsByCategory
// } = require('../controllers/food.controller');
// const { protect, authorize } = require('../middleware/auth');
// const upload = require('../middleware/upload');
// const { validateFood } = require('../middleware/validation');
// const reviewRoutes = require('./review.routes');


// // Public routes
// router.get('/', getFoods);
// router.get('/:id', getFood);
// router.get('/category/:categoryId', getFoodsByCategory);

// router.use('/:id/reviews', reviewRoutes);


// // Admin routes (protected)
// router.post('/', 
//     protect, 
//     authorize('admin'), 
//     upload.single('image'), 
//     validateFood, // This is an array, so it will be spread automatically by Express
//     createFood
// );

// router.put('/:id', 
//     protect, 
//     authorize('admin'), 
//     upload.single('image'), 
//     validateFood, 
//     updateFood
// );

// router.delete('/:id', 
//     protect, 
//     authorize('admin'), 
//     deleteFood
// );

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
    getFoods,
    getFood,
    createFood,
    updateFood,
    deleteFood,
    getFoodsByCategory
} = require('../controllers/food.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateFood } = require('../middleware/validation');

// Make sure all controller functions exist
console.log('Food controller functions loaded:', {
    getFoods: typeof getFoods,
    getFood: typeof getFood,
    createFood: typeof createFood,
    updateFood: typeof updateFood,
    deleteFood: typeof deleteFood,
    getFoodsByCategory: typeof getFoodsByCategory
});

// Public routes
router.get('/', getFoods);
router.get('/:id', getFood);
router.get('/category/:categoryId', getFoodsByCategory);

// Admin routes (protected)
router.post('/', protect, authorize('admin'), upload.single('image'), createFood);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateFood);
router.delete('/:id', protect, authorize('admin'), deleteFood);

module.exports = router;