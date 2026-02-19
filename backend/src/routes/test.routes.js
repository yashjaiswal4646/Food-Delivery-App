const express = require('express');
const router = express.Router();

// Simple test route without any middleware
router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Test route with protect middleware
const { protect } = require('../middleware/auth');
router.get('/protected', protect, (req, res) => {
    res.json({ message: 'Protected route works', user: req.user?.id });
});

module.exports = router;