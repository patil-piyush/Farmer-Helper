const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/auth/login?error=Please log in to continue');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      res.clearCookie('token');
      return res.redirect('/auth/login?error=Session expired, please log in again');
    }
    
    // Get user data
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      res.clearCookie('token');
      return res.redirect('/auth/login?error=User not found');
    }

    // Set user data in request and response locals
    req.user = user;
    req.user.userId = user._id;
    res.locals.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.clearCookie('token');
    res.redirect('/auth/login?error=Authentication failed');
  }
};

module.exports = auth; 