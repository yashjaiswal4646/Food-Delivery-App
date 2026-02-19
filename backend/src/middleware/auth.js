const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token found in headers');
        }

        if (!token) {
            console.log('No token found');
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token verified for user:', decoded.id);

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                console.log('User not found for id:', decoded.id);
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if user is blocked
            if (user.isBlocked) {
                console.log('User is blocked:', user.id);
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been blocked. Please contact admin.'
                });
            }

            // Attach user to request object
            req.user = user;
            console.log('User authenticated:', user.id);
            next(); // Make sure next() is called
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};