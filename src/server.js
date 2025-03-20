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

// MongoDB Connection (optional for MVP)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.log('MongoDB connection skipped - running with mock data');
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/auth', require('./routes/auth'));
app.use('/api/crops', auth, require('./routes/crops'));
app.use('/api/disease', auth, require('./routes/disease'));
app.use('/api/weather', auth, require('./routes/weather'));
app.use('/api/market', auth, require('./routes/market'));

// Home page (landing page)
app.get('/home', (req, res) => {
  res.render('home', { 
    title: 'Welcome',
    path: '/home',
    user: null
  });
});

// Redirect root to home page if not logged in
app.get('/', (req, res) => {
  if (!req.user) {
    return res.redirect('/home');
  }
  res.redirect('/dashboard');
});

// Dashboard route (protected)
app.get('/dashboard', auth, async (req, res) => {
  const user = await mongoose.model('User').findById(req.user.userId);
  res.render('dashboard', { 
    title: 'Dashboard',
    path: '/dashboard',
    script: '',
    user
  });
});

app.get('/crops', auth, async (req, res) => {
  const user = await mongoose.model('User').findById(req.user.userId);
  res.render('crops', { 
    title: 'Crop Selection',
    path: '/crops',
    script: '',
    user
  });
});

app.get('/disease', auth, async (req, res) => {
  const user = await mongoose.model('User').findById(req.user.userId);
  res.render('disease', { 
    title: 'Disease Detection',
    path: '/disease',
    script: '',
    user
  });
});

app.get('/weather', auth, async (req, res) => {
  const user = await mongoose.model('User').findById(req.user.userId);
  res.render('weather', { 
    title: 'Weather Forecast',
    path: '/weather',
    script: '',
    user
  });
});

app.get('/market', auth, async (req, res) => {
  const user = await mongoose.model('User').findById(req.user.userId);
  res.render('market', { 
    title: 'Market Prices',
    path: '/market',
    script: '',
    user
  });
});

app.get('/profile', auth, async (req, res) => {
  const user = await mongoose.model('User').findById(req.user.userId);
  res.render('profile', { 
    title: 'Profile',
    path: '/profile',
    script: '',
    user,
    query: req.query
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 