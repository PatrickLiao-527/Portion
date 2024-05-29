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
            col_name => col_name !== '_id' && col_name !== '__v' && schemaPaths[col_name].isRequired
        );

        for (const col_name of columnNames) {
            if (!req.body.hasOwnProperty(col_name)) {
                return res.status(400).json({
                    message: `Error: Send all required fields, missing ${col_name}`
                });
            }
        }

        // Create and add to database
        const newMenuItem = { ...req.body };
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
            col_name => col_name !== '_id' && col_name !== '__v' && schemaPaths[col_name].isRequired
        );

        for (const col_name of columnNames) {
            if (!req.body.hasOwnProperty(col_name)) {
                return res.status(400).json({
                    message: `Error: Send all required fields, missing ${col_name}`
                });
            }
        }

        const { id } = req.params;
        const result = await Menu.findByIdAndUpdate(id, req.body, { new: true });

        if (!result) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

// Delete menu item by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Menu.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        return res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;
