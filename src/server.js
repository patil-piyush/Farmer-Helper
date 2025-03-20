const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

// Load environment variables
dotenv.config();

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/crops', auth, require('./routes/crops'));
app.use('/api/disease', auth, require('./routes/disease'));
app.use('/api/weather', auth, require('./routes/weather'));
app.use('/api/market', auth, require('./routes/market'));

// Home page (landing page)
app.get('/', (req, res) => {
  res.render('home', { 
    title: 'Welcome to Farmer Helper',
    path: '/home',
    user: req.user || null
  });
});

// Dashboard route (protected)
app.get('/dashboard', auth, async (req, res) => {
  try {
    res.render('dashboard', { 
      title: 'Dashboard',
      path: '/dashboard',
      script: '',
      user: req.user
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.redirect('/');
  }
});

app.get('/crops', auth, async (req, res) => {
  try {
    res.render('crops', { 
      title: 'Crop Selection',
      path: '/crops',
      script: '',
      user: req.user
    });
  } catch (error) {
    console.error('Crops error:', error);
    res.redirect('/');
  }
});

app.get('/disease', auth, async (req, res) => {
  try {
    res.render('disease', { 
      title: 'Disease Detection',
      path: '/disease',
      script: '',
      user: req.user
    });
  } catch (error) {
    console.error('Disease error:', error);
    res.redirect('/');
  }
});

app.get('/weather', auth, async (req, res) => {
  try {
    res.render('weather', { 
      title: 'Weather Forecast',
      path: '/weather',
      script: '',
      user: req.user
    });
  } catch (error) {
    console.error('Weather error:', error);
    res.redirect('/');
  }
});

app.get('/market', auth, async (req, res) => {
  try {
    res.render('market', { 
      title: 'Market Prices',
      path: '/market',
      script: '',
      user: req.user
    });
  } catch (error) {
    console.error('Market error:', error);
    res.redirect('/');
  }
});

app.get('/profile', auth, async (req, res) => {
  try {
    res.render('profile', { 
      title: 'Profile',
      path: '/profile',
      script: '',
      user: req.user,
      query: req.query
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.redirect('/');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('error', {
    title: 'Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    user: req.user || null,
    path: req.path
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 Not Found',
    error: 'Page not found',
    user: req.user || null,
    path: req.path
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 