import express from 'express';
import path from 'path';
import Menu from '../models/menuModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/checkRole.js';
import multer from 'multer';

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, req.menuItemId + extension);  // needs handle bad file type
  }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

// Create a new menu item
router.post('/', authMiddleware, checkRole('owner'), async (req, res, next) => {
  try {
    console.log(JSON.stringify(req.body));

    // Check required fields
    const schemaPaths = Menu.schema.paths;
    const columnNames = Object.keys(schemaPaths).filter(
      col_name => col_name !== '_id' && col_name !== '__v' && col_name !== 'ownerId' && schemaPaths[col_name].isRequired
    );
    for (const col_name of columnNames) {
      if (!Object.prototype.hasOwnProperty.call(req.body, col_name)) {
        return res.status(400).json({
          message: `Error: Send all required fields, missing ${col_name}`
        });
      }
    }

    // Create the menu item with the data received
    const newMenuItem = {
      ...req.body,
      ownerId: req.user._id
    };
    console.log(JSON.stringify(newMenuItem));
    delete newMenuItem.itemPicture;

    const menuItem = await Menu.create(newMenuItem);
    req.menuItemId = menuItem._id; // Pass the menu item ID to the next middleware
    next(); // Call the next middleware to handle file upload
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}, upload.single('itemPicture'), async (req, res) => {  // store image with menuItemId in req
  try {
    const { menuItemId } = req;
    const menuItem = await Menu.findById(menuItemId);

    if (!menuItem) {
      // Delete the uploaded file if the menu item is not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await menuItem.save();

    res.status(201).json(menuItem);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal server error' });
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

router.put('/:id', authMiddleware, checkRole('owner'), upload.single('itemPicture'), async (req, res) => {
  try {
    // Check required fields
    const schemaPaths = Menu.schema.paths;
    const columnNames = Object.keys(schemaPaths).filter(
      col_name => col_name !== '_id' && col_name !== '__v' && col_name !== 'ownerId' && schemaPaths[col_name].isRequired
    );

    for (const col_name of columnNames) {
      if (!Object.prototype.hasOwnProperty.call(req.body, col_name)) {
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

    // Update all fields except the image
    menuItem.itemName = req.body.itemName;
    menuItem.carbsPrice = req.body.carbsPrice;
    menuItem.proteinType = req.body.proteinType;
    menuItem.proteinsPrice = req.body.proteinsPrice;
    menuItem.baseFat = req.body.baseFat;

    // Save the updated menu item
    const updatedMenuItem = await menuItem.save();
    res.status(200).json(updatedMenuItem);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete menu item by ID
router.delete('/:id', authMiddleware, checkRole('owner'), async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this menu item' });
    }

    await Menu.deleteOne({ _id: id });

    return res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
