const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register page
router.get('/register', (req, res) => {
  try {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('register', { 
      title: 'Register',
      error: req.query.error || null,
      user: null,
      path: '/register',
      req: req
    });
  } catch (error) {
    console.error('Register page error:', error);
    res.render('register', {
      title: 'Register',
      error: 'Error loading registration page',
      user: null,
      path: '/register',
      req: req
    });
  }
});

// Login page
router.get('/login', (req, res) => {
  try {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('login', { 
      title: 'Login',
      error: req.query.error || null,
      user: null,
      path: '/login',
      req: req
    });
  } catch (error) {
    console.error('Login page error:', error);
    res.render('login', {
      title: 'Login',
      error: 'Error loading login page',
      user: null,
      path: '/login',
      req: req
    });
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, location, farmSize } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.render('register', {
        title: 'Register',
        error: 'Please fill in all required fields',
        user: null,
        path: '/register'
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.render('register', {
        title: 'Register',
        error: 'Passwords do not match',
        user: null,
        path: '/register'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.render('register', {
        title: 'Register',
        error: 'User already exists',
        user: null,
        path: '/register'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      location: location || undefined,
      farmSize: farmSize ? parseFloat(farmSize) : undefined
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Redirect to dashboard instead of home
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', {
      title: 'Register',
      error: 'Error creating account',
      user: null,
      path: '/register'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.render('login', {
        title: 'Login',
        error: 'Please fill in all fields',
        user: null,
        path: '/login'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid credentials',
        user: null,
        path: '/login'
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid credentials',
        user: null,
        path: '/login'
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Redirect to dashboard instead of home
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      title: 'Login',
      error: 'Error logging in',
      user: null,
      path: '/login'
    });
  }
});

// Logout user
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Update user profile
router.post('/profile', auth, async (req, res) => {
  try {
    const { name, location, farmSize } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.redirect('/auth/login');
    }
    
    if (name) user.name = name;
    if (location) user.location = location;
    if (farmSize) user.farmSize = parseFloat(farmSize);
    
    await user.save();
    
    // Redirect back to profile page with success message
    res.redirect('/profile?success=Profile updated successfully');
  } catch (error) {
    console.error('Profile update error:', error);
    res.redirect('/profile?error=Error updating profile');
  }
});

// Update password
router.post('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    
    // Validate password match
    if (newPassword !== confirmNewPassword) {
      return res.redirect('/profile?error=New passwords do not match');
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.redirect('/auth/login');
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.redirect('/profile?error=Current password is incorrect');
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    res.redirect('/profile?success=Password updated successfully');
  } catch (error) {
    console.error('Password update error:', error);
    res.redirect('/profile?error=Error updating password');
  }
});

// API Routes
router.get('/api/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

router.post('/api/profile', auth, async (req, res) => {
  try {
    const { name, location, farmSize } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (location) user.location = location;
    if (farmSize) user.farmSize = parseFloat(farmSize);
    
    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

router.post('/api/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Error updating password' });
  }
});

module.exports = router; 