const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check if API key exists
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log('Gemini API Key exists:', !!GEMINI_API_KEY);

if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables!');
}

// Initialize Gemini AI only if API key exists
let genAI = null;
try {
    if (GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        console.log('✅ Gemini AI initialized successfully');
    }
} catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error.message);
}

// System prompt
const getSystemPrompt = () => {
    return `You are "FoodieAI", a helpful customer support assistant for a food delivery application called "FoodieExpress". 

Keep responses short, friendly, and helpful (2-3 sentences max).

Key information about FoodieExpress:
- Delivery time: 30-45 minutes
- Free delivery on orders above Rs.500
- Minimum order: Rs.99
- Payment methods: Cash on Delivery, Credit/Debit Card, UPI
- Customer support: support@foodieexpress.com (9 AM - 9 PM)
- Track orders in "My Orders" page
- Cancel orders only before restaurant starts preparing

Answer this user question helpfully:`;
};

// @desc    Process AI chat query with Gemini
// @route   POST /api/ai/chat
// @access  Private
exports.chatWithAI = async (req, res) => {
    try {
        console.log('=== AI Chat Request ===');
        
        const { message, conversationHistory = [] } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Please enter a message'
            });
        }

        console.log('User message:', message);

        // If Gemini is not available, use mock response
        if (!genAI) {
            console.log('Using mock response - Gemini not available');
            const mockResponse = getMockResponse(message);
            return res.json({
                success: true,
                response: mockResponse,
                timestamp: new Date().toISOString()
            });
        }

        try {
            // Use the correct model name - "gemini-1.5-flash" or "gemini-1.5-pro"
            // "gemini-1.5-flash" is faster and cheaper, recommended for chat
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const prompt = `${getSystemPrompt()}\n\nUser: ${message}\n\nAssistant:`;
            
            console.log('Sending request to Gemini...');
            
            // Generate response with timeout
            const result = await Promise.race([
                model.generateContent(prompt),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Gemini API timeout')), 15000)
                )
            ]);
            
            const response = await result.response;
            const aiResponse = response.text();
            
            console.log('Gemini response received');
            
            res.json({
                success: true,
                response: aiResponse,
                timestamp: new Date().toISOString()
            });
            
        } catch (geminiError) {
            console.error('Gemini API error:', geminiError.message);
            
            // Check for specific errors
            if (geminiError.message.includes('404')) {
                // Try alternative model name
                try {
                    console.log('Trying alternative model: gemini-1.5-pro');
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
                    const result = await model.generateContent(`${getSystemPrompt()}\n\nUser: ${message}\n\nAssistant:`);
                    const response = await result.response;
                    const aiResponse = response.text();
                    
                    return res.json({
                        success: true,
                        response: aiResponse,
                        timestamp: new Date().toISOString()
                    });
                } catch (altError) {
                    console.error('Alternative model also failed:', altError.message);
                }
            }
            
            // Fallback to mock response
            const mockResponse = getMockResponse(message);
            res.json({
                success: true,
                response: mockResponse,
                fallback: true,
                timestamp: new Date().toISOString()
            });
        }
        
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({
            success: false,
            message: 'Service temporarily unavailable. Please try again.'
        });
    }
};

// Comprehensive mock responses
const getMockResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    
    const responses = {
        'track my order': "📦 You can track your order from the 'My Orders' page! Go to your account, click on 'My Orders', and select the order you want to track. You'll see real-time status updates from 'Pending' → 'Preparing' → 'Out for Delivery' → 'Delivered'.",
        
        'track': "📦 Track your order in real-time! Go to 'My Orders' in your account, click on the order, and you'll see the current status and estimated delivery time.",
        
        'delivery time': "🚚 Delivery typically takes 30-45 minutes from order confirmation. You'll get free delivery on orders above Rs.500! Track your order in 'My Orders' for real-time updates.",
        
        'payment': "💳 We accept multiple payment methods:\n• Cash on Delivery (COD)\n• Credit/Debit Cards\n• UPI (Google Pay, PhonePe, Paytm)\nAll payments are secure and encrypted!",
        
        'cancel': "❌ You can cancel your order only while it's in 'Pending' status. Go to 'My Orders', find your order, and click 'Cancel' if available. Once the restaurant starts preparing, cancellation isn't possible.",
        
        'vegetarian': "🥗 Yes! We have many vegetarian options. Use the 'Vegetarian' filter on our Menu page to see only veg items. Look for the green 'Veg' badge on food items!",
        
        'refund': "💰 For refunds, please contact our customer support within 24 hours of delivery. Email support@foodieexpress.com with your order ID and issue details. We'll review and process refunds within 2-3 business days.",
        
        'password': "🔐 Forgot your password? Click 'Forgot Password' on the login page, enter your email, and we'll send you a reset link. Check your inbox (and spam folder) for the email!",
        
        'profile': "👤 To update your profile, click on your name in the top navigation and select 'Profile'. You can update your name, phone number, and delivery address there.",
        
        'minimum order': "💰 Minimum order value is Rs.99. Free delivery on orders above Rs.500!",
        
        'contact': "📞 Customer Support:\n• Email: support@foodieexpress.com\n• Hours: 9 AM - 9 PM daily\n• Response time: Within 2 hours\n• For urgent issues, please call our support number.",
        
        'promotion': "🎉 Current offers:\n• Free delivery on orders above Rs.500\n• New users get 10% off first order\n• Refer a friend and get Rs.100 credit\nCheck the 'Offers' section for more!"
    };
    
    // Check for matches
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMsg.includes(key)) {
            return response;
        }
    }
    
    // Default response
    return "🍕 Hi! I'm FoodieAI, your food delivery assistant. I can help you with:\n\n📦 Tracking orders\n🚚 Delivery times\n💳 Payment methods\n❌ Cancellations\n🥗 Vegetarian options\n💰 Refunds\n🔐 Password reset\n👤 Profile updates\n\nWhat would you like to know?";
};

// @desc    Get AI suggestions for common questions
// @route   GET /api/ai/suggestions
// @access  Public
exports.getSuggestions = async (req, res) => {
    try {
        const suggestions = [
            "How do I track my order?",
            "How long does delivery take?",
            "What payment methods do you accept?",
            "Can I cancel my order?",
            "Do you have vegetarian options?",
            "What is your refund policy?",
            "How do I reset my password?",
            "How to update my profile?",
            "Free delivery minimum order?",
            "How to contact customer support?"
        ];

        res.json({
            success: true,
            suggestions
        });
    } catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({
            success: false,
            suggestions: []
        });
    }
};