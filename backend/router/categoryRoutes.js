// routes/categoryRoutes.js
import express from 'express';
import Category from '../models/categoryModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all categories (public access)
router.get('/', authMiddleware, async (req, res) => {
  if (req.isPublic) {
    // Public access logic
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Authenticated access logic
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Create a new category (public access)
router.post('/', authMiddleware, async (req, res) => {
  if (req.isPublic) {
    // Public access logic
    try {
      const { name } = req.body;
      const category = new Category({ name });
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Authenticated access logic
    try {
      const { name } = req.body;
      const category = new Category({ name });
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
