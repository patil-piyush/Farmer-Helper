# Farmer Helper - AI-Powered Precision Farming & Advisory System

A comprehensive web application that helps farmers improve their farming practices using AI technology.

## Features

- **AI-Based Crop Disease Detection**: Upload crop images for instant disease identification and treatment suggestions
- **AI-Powered Market Price Predictor**: Get real-time market trends and optimal selling time recommendations
- **AI-Based Weather & Climate Risk Prediction**: Receive alerts about weather conditions and climate risks
- **AI-Based Crop Selection Helper**: Get personalized crop recommendations based on soil and climate conditions

## Tech Stack

- Frontend: React.js
- Backend: Node.js/Express
- Database: MongoDB
- AI/ML: TensorFlow.js, OpenCV.js

## Project Structure

```
farmer-helper/
├── backend/           # Node.js backend application
└── README.md          # Project documentation
```

## Setup Instructions

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### Backend Setup
1. Navigate to the backend directory
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables
4. Start the server: `npm start`

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
