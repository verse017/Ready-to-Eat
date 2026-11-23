const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.ATLAS_URI;
if (uri && !uri.includes('YOUR_PASSWORD') && !uri.includes('your_password')) {
  mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
      console.log('MongoDB database connection established successfully');
      try {
        const Restaurant = require('./models/Restaurant');
        const seedData = require('./seedData');
        const count = await Restaurant.countDocuments();
        if (count === 0) {
          await Restaurant.insertMany(seedData);
          console.log('Seeded initial 10 Kathmandu restaurants into MongoDB');
        }
      } catch (seedErr) {
        console.log('Seed check notice:', seedErr.message);
      }
    })
    .catch(err => {
      console.warn('MongoDB connection note:', err.message);
      console.warn('Server running with in-memory storage fallback.');
    });
} else {
  console.log('Running with local in-memory storage (Set ATLAS_URI in .env to connect to MongoDB)');
}

// Routes
const restaurantsRouter = require('./routes/restaurants');
app.use('/api/restaurants', restaurantsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'in-memory fallback'
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Ready to Eat server is running on port: ${port}`);
});
