const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const incidentRoutes = require('./routes/incidents');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || '27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'incident_management';
const MONGO_URI = process.env.MONGO_URI || `mongodb://${MONGO_HOST}:${MONGO_PORT}/${DATABASE_NAME}`;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Routes
app.use('/api/incidents', incidentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
