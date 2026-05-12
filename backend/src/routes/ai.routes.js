const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { chatWithAI, getSuggestions } = require('../controllers/ai.controller');

// Public route for suggestions
router.get('/suggestions', getSuggestions);

// Protected route for chat (requires login)
router.post('/chat', protect, chatWithAI);

module.exports = router;