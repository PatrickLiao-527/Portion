import express from 'express';
import Menu from '../models/menuModel.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

// Create a new menu item
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Check required fields
    const schemaPaths = Menu.schema.paths;
    const columnNames = Object.keys(schemaPaths).filter(
      col_name => col_name !== '_id' && col_name !== '__v' && col_name !== 'ownerId' && schemaPaths[col_name].isRequired
    );

    for (const col_name of columnNames) {
      if (!req.body.hasOwnProperty(col_name)) {
        return res.status(400).json({
          message: `Error: Send all required fields, missing ${col_name}`
        });
      }
    }

    // Create and add to database with ownerId set to the authenticated user
    const newMenuItem = { ...req.body, ownerId: req.user._id };
    const menuItem = await Menu.create(newMenuItem);

    return res.status(201).json(menuItem);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get all menu items
router.get('/', authMiddleware, async (req, res) => {
    try {
        const menuItems = await Menu.find({ ownerId: req.user._id });
        return res.status(200).json({
            length: menuItems.length,
            data: menuItems
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

// Get menu item by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this menu item' });
    }

    return res.status(200).json({
      data: menuItem
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
});

// Update menu item by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Check required fields
    const schemaPaths = Menu.schema.paths;
    const columnNames = Object.keys(schemaPaths).filter(
      col_name => col_name !== '_id' && col_name !== '__v' && col_name !== 'ownerId' && schemaPaths[col_name].isRequired
    );

    for (const col_name of columnNames) {
      if (!req.body.hasOwnProperty(col_name)) {
        return res.status(400).json({
          message: `Error: Send all required fields, missing ${col_name}`
        });
      }
    }

    const { id } = req.params;
    const menuItem = await Menu.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this menu item' });
    }

    Object.assign(menuItem, req.body);
    const updatedMenuItem = await menuItem.save();

    res.status(200).json(updatedMenuItem);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete menu item by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this menu item' });
    }

    await menuItem.remove();

    return res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
