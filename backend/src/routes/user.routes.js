const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Simple authentication middleware (no next() issues)
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user id to request
    req.userId = decoded.id;
    next();
    
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// GET user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.userId);
    
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// UPDATE user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    console.log('=== PROFILE UPDATE ===');
    console.log('User ID:', req.userId);
    console.log('Request body:', req.body);

    const { name, phone, address } = req.body;

    // Validate input
    if (!name && !phone && !address) {
      return res.status(400).json({
        success: false,
        message: 'No data provided to update'
      });
    }

    // Find user
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    let updated = false;
    
    if (name && name !== user.name) {
      user.name = name;
      updated = true;
    }
    
    if (phone && phone !== user.phone) {
      // Validate phone number (10 digits)
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must be 10 digits'
        });
      }
      user.phone = phone;
      updated = true;
    }
    
    // Update address if provided
    if (address) {
      // Initialize address if it doesn't exist
      if (!user.address) user.address = {};
      
      if (address.street !== undefined) {
        user.address.street = address.street;
        updated = true;
      }
      if (address.city !== undefined) {
        user.address.city = address.city;
        updated = true;
      }
      if (address.state !== undefined) {
        user.address.state = address.state;
        updated = true;
      }
      if (address.zipCode !== undefined) {
        user.address.zipCode = address.zipCode;
        updated = true;
      }
      if (address.country !== undefined) {
        user.address.country = address.country;
        updated = true;
      }
    }

    // Only save if something changed
    if (updated) {
      await user.save();
      console.log('User updated successfully');
    } else {
      console.log('No changes detected');
    }

    // Return updated user
    const updatedUser = await User.findById(req.userId).select('-password');

    res.json({
      success: true,
      user: updatedUser,
      message: updated ? 'Profile updated successfully' : 'No changes made'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating profile'
    });
  }
});

module.exports = router;