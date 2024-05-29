import express from 'express';
import Restaurant from '../models/restaurantModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new restaurant
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, img } = req.body;

    // Check required fields
    if (!name || !description || !img) {
      return res.status(400).json({ message: 'Please provide all required fields: name, description, img' });
    }

    const newRestaurant = new Restaurant({
      ownerId: req.user._id,
      name,
      description,
      img
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all restaurants for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ ownerId: req.user._id });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific restaurant by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this restaurant' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
