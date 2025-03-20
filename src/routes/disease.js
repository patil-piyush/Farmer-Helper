const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Mock disease data for MVP
const diseases = [
  {
    id: 1,
    name: 'Wheat Rust',
    symptoms: 'Orange-brown pustules on leaves',
    treatment: 'Apply fungicide and maintain proper spacing'
  },
  {
    id: 2,
    name: 'Rice Blast',
    symptoms: 'Diamond-shaped lesions on leaves',
    treatment: 'Use resistant varieties and proper water management'
  }
];

// Upload image and detect disease
router.post('/detect', upload.single('image'), (req, res) => {
  try {
    // Mock disease detection for MVP
    const mockResult = {
      disease: diseases[0],
      confidence: 0.85,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    };
    res.json(mockResult);
  } catch (error) {
    res.status(500).json({ message: 'Error detecting disease' });
  }
});

// Get all diseases
router.get('/', (req, res) => {
  res.json(diseases);
});

module.exports = router; 