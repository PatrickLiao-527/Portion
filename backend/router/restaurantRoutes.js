import express from 'express';
import Restaurant from '../models/restaurantModel.js';
import Menu from '../models/menuModel.js';
import mongoose from 'mongoose';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new restaurant (public access)
router.post('/', async (req, res) => {
  try {
    const { name, category, img } = req.body;

    // Check required fields
    if (!name || !category) {
      return res.status(400).json({ message: 'Please provide all required fields: name, category' });
    }

    // Check if restaurant name already exists
    const existingRestaurant = await Restaurant.findOne({ name });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'Restaurant name already exists' });
    }

    const newRestaurant = new Restaurant({
      name,
      category,
      img
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all restaurants (public access)
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
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

router.get('/:restaurantId/menu-items', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    //console.log('Received restaurantId:', restaurantId);

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      console.log('Invalid restaurant ID');
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    // Log the connection status
    //console.log('Mongoose connection state:', mongoose.connection.readyState);

    const menuItems = await Menu.find({ ownerId: restaurantId });
    //console.log('Query executed with ownerId:', restaurantId);
    //console.log('Fetched menu items:', menuItems);

    if (menuItems.length === 0) {
      console.log('No menu items found for restaurant:', restaurantId);
    }

    return res.status(200).json(menuItems); // Sending the array directly
  } catch (err) {
    console.log('Error fetching menu items:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get a restaurant by name (public access)
router.get('/name/:name', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ name: req.params.name });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;
