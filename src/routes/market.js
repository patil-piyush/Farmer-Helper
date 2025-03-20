const express = require('express');
const router = express.Router();

// Mock market data for MVP
const marketData = {
  wheat: {
    currentPrice: 2500,
    historicalPrices: [
      { date: '2024-02-20', price: 2400 },
      { date: '2024-03-01', price: 2450 },
      { date: '2024-03-10', price: 2500 }
    ],
    predictedPrice: 2600,
    trend: 'Upward'
  },
  rice: {
    currentPrice: 3000,
    historicalPrices: [
      { date: '2024-02-20', price: 2900 },
      { date: '2024-03-01', price: 2950 },
      { date: '2024-03-10', price: 3000 }
    ],
    predictedPrice: 3100,
    trend: 'Upward'
  }
};

// Get current market prices
router.get('/prices', (req, res) => {
  const prices = Object.entries(marketData).map(([crop, data]) => ({
    crop,
    currentPrice: data.currentPrice,
    trend: data.trend
  }));
  res.json(prices);
});

// Get price prediction for a specific crop
router.post('/predict', (req, res) => {
  const { crop, date } = req.body;

  if (!crop || !date) {
    return res.status(400).json({ message: 'Crop and date are required' });
  }

  const cropData = marketData[crop.toLowerCase()];
  if (!cropData) {
    return res.status(404).json({ message: 'Crop not found' });
  }

  // Mock prediction data
  const response = {
    crop,
    currentPrice: cropData.currentPrice,
    predictedPrice: cropData.predictedPrice,
    trend: cropData.trend,
    confidence: 0.85,
    recommendation: cropData.trend === 'Upward' 
      ? 'Consider holding your stock for better prices'
      : 'Consider selling at current market price'
  };

  res.json(response);
});

// Get historical prices for a specific crop
router.get('/history/:crop', (req, res) => {
  const crop = req.params.crop.toLowerCase();
  if (!marketData[crop]) {
    return res.status(404).json({ message: 'Crop not found' });
  }
  res.json(marketData[crop].historicalPrices);
});

module.exports = router; 