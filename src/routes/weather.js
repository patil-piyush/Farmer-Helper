const express = require('express');
const router = express.Router();

// Mock weather data for MVP
const weatherData = {
  current: {
    temperature: 25,
    humidity: 65,
    rainfall: 0,
    windSpeed: 12
  },
  forecast: [
    {
      date: '2024-03-20',
      temperature: 26,
      humidity: 70,
      rainfall: 0.5,
      windSpeed: 15
    },
    {
      date: '2024-03-21',
      temperature: 24,
      humidity: 75,
      rainfall: 2,
      windSpeed: 18
    }
  ]
};

// Get current weather
router.get('/current', (req, res) => {
  res.json(weatherData.current);
});

// Get weather forecast
router.get('/forecast', (req, res) => {
  res.json(weatherData.forecast);
});

// Get weather risk assessment
router.get('/risk', (req, res) => {
  const riskAssessment = {
    riskLevel: 'Low',
    concerns: ['Possible light rain in 2 days'],
    recommendations: ['Monitor soil moisture levels']
  };
  res.json(riskAssessment);
});

module.exports = router; 