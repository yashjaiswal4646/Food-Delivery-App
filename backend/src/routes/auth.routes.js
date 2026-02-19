const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getMe
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected route
router.get('/me', protect, getMe);

module.exports = router;