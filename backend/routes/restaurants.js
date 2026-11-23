const router = require('express').Router();
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const seedData = require('../seedData');

// In-memory fallback storage in case MongoDB is disconnected/offline
let memoryStorage = seedData.map((item, index) => ({
  _id: 'local_' + (index + 1),
  ...item,
  createdAt: new Date().toISOString()
}));

const isMongoConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// GET all restaurants
router.route('/').get(async (req, res) => {
  try {
    if (isMongoConnected()) {
      const count = await Restaurant.countDocuments();
      if (count === 0) {
        await Restaurant.insertMany(seedData);
      }
      const restaurants = await Restaurant.find().sort({ createdAt: -1 });
      return res.json(restaurants);
    } else {
      return res.json(memoryStorage);
    }
  } catch (err) {
    console.error('Error in GET /:', err.message);
    return res.json(memoryStorage);
  }
});

// GET recommendations (rating >= 4.0)
router.route('/recommendations').get(async (req, res) => {
  try {
    if (isMongoConnected()) {
      const count = await Restaurant.countDocuments();
      if (count === 0) {
        await Restaurant.insertMany(seedData);
      }
      const restaurants = await Restaurant.find({ rating: { $gte: 4 } }).sort({ rating: -1 });
      return res.json(restaurants);
    } else {
      const filtered = memoryStorage
        .filter(r => Number(r.rating) >= 4)
        .sort((a, b) => Number(b.rating) - Number(a.rating));
      return res.json(filtered);
    }
  } catch (err) {
    console.error('Error in GET /recommendations:', err.message);
    const filtered = memoryStorage
      .filter(r => Number(r.rating) >= 4)
      .sort((a, b) => Number(b.rating) - Number(a.rating));
    return res.json(filtered);
  }
});

// POST add a new restaurant
router.route('/add').post(async (req, res) => {
  try {
    const { name, cuisine, location, rating, description, image } = req.body;

    if (!name || !cuisine || !location) {
      return res.status(400).json({ error: 'Name, cuisine, and location are required.' });
    }

    const defaultImage = image && image.trim() !== ''
      ? image.trim()
      : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';

    const restaurantData = {
      name: name.trim(),
      cuisine: cuisine.trim(),
      location: location.trim(),
      rating: Number(rating) || 4.5,
      description: (description || '').trim(),
      image: defaultImage
    };

    if (isMongoConnected()) {
      const newRestaurant = new Restaurant(restaurantData);
      const saved = await newRestaurant.save();
      return res.status(201).json({ message: 'Restaurant added successfully!', restaurant: saved });
    } else {
      const newLocal = {
        _id: 'local_' + Date.now(),
        ...restaurantData,
        createdAt: new Date().toISOString()
      };
      memoryStorage.unshift(newLocal);
      return res.status(201).json({ message: 'Restaurant added successfully!', restaurant: newLocal });
    }
  } catch (err) {
    console.error('Error in POST /add:', err.message);
    return res.status(500).json({ error: err.message || 'Failed to add restaurant.' });
  }
});

// GET a single restaurant by id
router.route('/:id').get(async (req, res) => {
  try {
    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(req.params.id)) {
      const restaurant = await Restaurant.findById(req.params.id);
      if (restaurant) return res.json(restaurant);
    }
    const found = memoryStorage.find(r => String(r._id) === String(req.params.id));
    if (found) return res.json(found);
    return res.status(404).json({ error: 'Restaurant not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT update a restaurant
router.route('/update/:id').put(async (req, res) => {
  try {
    const { name, cuisine, location, rating, description, image } = req.body;

    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(req.params.id)) {
      const updated = await Restaurant.findByIdAndUpdate(
        req.params.id,
        {
          name: name ? name.trim() : undefined,
          cuisine: cuisine ? cuisine.trim() : undefined,
          location: location ? location.trim() : undefined,
          rating: rating ? Number(rating) : undefined,
          description: description !== undefined ? description.trim() : undefined,
          image: image !== undefined ? image.trim() : undefined,
        },
        { new: true, runValidators: true }
      );
      if (updated) return res.json({ message: 'Restaurant updated!', restaurant: updated });
    }

    const index = memoryStorage.findIndex(r => String(r._id) === String(req.params.id));
    if (index !== -1) {
      memoryStorage[index] = {
        ...memoryStorage[index],
        name: name ? name.trim() : memoryStorage[index].name,
        cuisine: cuisine ? cuisine.trim() : memoryStorage[index].cuisine,
        location: location ? location.trim() : memoryStorage[index].location,
        rating: rating ? Number(rating) : memoryStorage[index].rating,
        description: description !== undefined ? description.trim() : memoryStorage[index].description,
        image: image !== undefined ? image.trim() : memoryStorage[index].image
      };
      return res.json({ message: 'Restaurant updated!', restaurant: memoryStorage[index] });
    }

    return res.status(404).json({ error: 'Restaurant not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE a restaurant
router.route('/:id').delete(async (req, res) => {
  try {
    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Restaurant.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Restaurant deleted.' });
    }

    const beforeLen = memoryStorage.length;
    memoryStorage = memoryStorage.filter(r => String(r._id) !== String(req.params.id));
    return res.json({ message: 'Restaurant deleted.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Reset / Seed route
router.route('/reset-seed').post(async (req, res) => {
  try {
    memoryStorage = seedData.map((item, index) => ({
      _id: 'local_' + (index + 1),
      ...item,
      createdAt: new Date().toISOString()
    }));
    if (isMongoConnected()) {
      await Restaurant.deleteMany({});
      await Restaurant.insertMany(seedData);
    }
    return res.json({ message: 'Seeded 10 Kathmandu restaurants successfully!' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
