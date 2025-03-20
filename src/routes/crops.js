const express = require('express');
const router = express.Router();

// Mock crop data for MVP
const crops = [
  {
    id: 1,
    name: 'Wheat',
    season: 'Winter',
    growthPeriod: '120 days',
    waterRequirement: 'Medium',
    soilType: 'Well-drained loamy soil'
  },
  {
    id: 2,
    name: 'Rice',
    season: 'Summer',
    growthPeriod: '150 days',
    waterRequirement: 'High',
    soilType: 'Clay soil'
  }
];

// Get all crops
router.get('/', (req, res) => {
  res.json(crops);
});

// Get crop by ID
router.get('/:id', (req, res) => {
  const crop = crops.find(c => c.id === parseInt(req.params.id));
  if (!crop) return res.status(404).json({ message: 'Crop not found' });
  res.json(crop);
});

// Get crop recommendations
router.post('/recommend', (req, res) => {
  const { soilType, ph, rainfall, temperature } = req.body;

  // Mock recommendation logic
  const recommendedCrops = [
    {
      name: 'Wheat',
      confidence: 0.85,
      expectedYield: 3.5,
      marketValue: 2500
    },
    {
      name: 'Rice',
      confidence: 0.75,
      expectedYield: 4.0,
      marketValue: 3000
    }
  ];

  const soilAnalysis = {
    pH: ph,
    nitrogen: 45.5,
    phosphorus: 32.8,
    potassium: 28.4,
    organicMatter: 2.5
  };

  const recommendations = [
    'Consider crop rotation to improve soil health',
    'Apply organic fertilizers to increase soil fertility',
    'Monitor soil moisture levels regularly'
  ];

  res.json({
    recommendedCrops,
    soilAnalysis,
    recommendations
  });
});

module.exports = router; 