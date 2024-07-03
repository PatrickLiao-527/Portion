import express from 'express';
import path from 'path';
import fs from 'fs';
import Restaurant from '../models/restaurantModel.js';
import Menu from '../models/menuModel.js';
import mongoose from 'mongoose';
import authMiddleware from '../middleware/authMiddleware.js';
import { validImageExtensions, validMimeTypes } from '../config.js';
import fetchImageMiddleware from '../middleware/fetchImageMiddleware.js';

const router = express.Router();

const getImageBase64 = (id, extension) => {
  const filePath = path.join('uploads', `${id}${extension}`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'base64');
  }
  return null;
};

// Create a new restaurant (public access)
router.post('/', async (req, res) => {
  try {
    const { name, category, img, ownerId } = req.body;

    // Check required fields
    if (!name || !category || !ownerId) {
      return res.status(400).json({ message: 'Please provide all required fields: name, category, ownerId' });
    }

    // Check if restaurant name already exists
    const existingRestaurant = await Restaurant.findOne({ name });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'Restaurant name already exists' });
    }

    const newRestaurant = new Restaurant({
      name,
      category,
      img,
      ownerId
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

    const restaurantsWithImages = restaurants.map(restaurant => {
      const extension = validImageExtensions.find(ext => fs.existsSync(path.join('uploads', `${restaurant._id}.${ext}`)));
      const imageBase64 = extension ? getImageBase64(restaurant._id, `.${extension}`) : null;
      return {
        ...restaurant.toObject(),
        img: imageBase64,
        imgExtension: extension
      };
    });

    res.status(200).json(restaurantsWithImages);
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

    const extension = validImageExtensions.find(ext => fs.existsSync(path.join('uploads', `${restaurant._id}.${ext}`)));
    const imageBase64 = extension ? getImageBase64(restaurant._id, `.${extension}`) : null;

    res.status(200).json({ ...restaurant.toObject(), img: imageBase64, imgExtension: extension });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get menu items for a specific restaurant
router.get('/:restaurantId/menu-items', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      console.log('Invalid restaurant ID');
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const menuItems = await Menu.find({ ownerId: restaurantId });

    const menuItemsWithImages = menuItems.map(menuItem => {
      const extension = validImageExtensions.find(ext => fs.existsSync(path.join('uploads', `${menuItem._id}.${ext}`)));
      const imageBase64 = extension ? getImageBase64(menuItem._id, `.${extension}`) : null;
      return {
        ...menuItem.toObject(),
        image: imageBase64,
        imageExtension: extension
      };
    });

    return res.status(200).json({ length: menuItemsWithImages.length, data: menuItemsWithImages });
  } catch (err) {
    console.log('Error fetching menu items:', err.message);
    res.status(500).json({ message: err.message });
  }
});
router.get('/image/:_id', fetchImageMiddleware('uploads'), (req, res) => {
  if (req.imageBase64 && req.imageExtension) {
    console.log(`Image fetched for menu item: ${req.imagePath}`);
    res.status(200).json({
      image: req.imageBase64,
      extension: req.imageExtension,
    });
  } else {
    console.log(`Image not found for menu item: ${req.params._id}`);
    res.status(404).json({ message: 'Image not found' });
  }
});


// Get a restaurant by name (public access)
router.get('/name/:name', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ name: req.params.name });

    if (!restaurant) {
      return res.status(200).json({ exists: false, message: 'Restaurant not found' });
    }

    res.status(200).json({ exists: true, restaurant });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;
