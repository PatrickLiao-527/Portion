import express from 'express';
import path from 'path';
import fs from 'fs';
import User from '../models/userModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Restaurant from '../models/restaurantModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Busboy from 'busboy';
import { fileTypeFromBuffer } from 'file-type';
import { validImageExtensions, validMimeTypes } from '../config.js';
import { broadcast } from '../websocket.js';

const router = express.Router();

const handleFileUpload = async (fileBuffer, id) => {
  const fileType = await fileTypeFromBuffer(Buffer.concat(fileBuffer));
  if (!fileType || !(fileType.mime in validMimeTypes)) {
    throw new Error('Invalid file type');
  }
  const extension = fileType.ext ? `.${fileType.ext}` : '';
  const saveTo = path.join('uploads', id + extension);
  fs.writeFileSync(saveTo, Buffer.concat(fileBuffer));
  return `${id}${extension}`;
};

const handleBusboy = (req, res, next) => {
  const busboy = Busboy({ headers: req.headers });
  const formData = {};
  const fileBuffer = [];
  let fileFieldName = '';

  busboy.on('field', (fieldname, val) => {
    formData[fieldname] = val;
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    fileFieldName = fieldname;
    file.on('data', (data) => {
      fileBuffer.push(data);
    });
  });

  busboy.on('finish', async () => {
    req.formData = formData;
    req.fileBuffer = fileBuffer;
    req.fileFieldName = fileFieldName;
    next();
  });

  req.pipe(busboy);
};

const getImageBase64 = (id, extension) => {
  const filePath = path.join('uploads', `${id}${extension}`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'base64');
  }
  return null;
};
const deleteOldImage = (id) => {
  const extensions = validImageExtensions;
  for (const ext of extensions) {
    const filePath = path.join('uploads', `${id}${ext}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old image: ${filePath}`);
      break;
    }
  }
};
// Update user profile
router.put('/profile', authMiddleware, handleBusboy, async (req, res) => {
  const { formData, fileBuffer } = req;
  const { name, restaurantName, restaurantCategory, newPassword } = formData;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name || user.name;

    let restaurant = null;
    if (user.role === 'owner') {
      restaurant = await Restaurant.findOne({ ownerId: user._id });
      if (!restaurant) {
        restaurant = new Restaurant({ ownerId: user._id, name: restaurantName, category: restaurantCategory });
      }
      restaurant.name = restaurantName || restaurant.name;
      restaurant.category = restaurantCategory || restaurant.category;

      if (fileBuffer.length > 0) {
        // Delete old image if it exists
        deleteOldImage(restaurant._id.toString());

        // Upload new image
        const fileName = await handleFileUpload(fileBuffer, restaurant._id.toString());
        restaurant.img = fileName;
      }

      await restaurant.save();
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    const restaurantWithImage = restaurant ? {
      ...restaurant.toObject(),
      image: getImageBase64(restaurant._id, '.jpg') || getImageBase64(restaurant._id, '.png') || null
    } : null;
    res.json({ message: 'Profile updated successfully', user, restaurant: restaurantWithImage });

    broadcast('profileUpdated', { user, restaurant: restaurantWithImage });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const restaurant = await Restaurant.findOne({ ownerId: user._id });
    const restaurantWithImage = restaurant ? {
      ...restaurant.toObject(),
      image: restaurant.img || null
    } : null;
    res.json({ user, restaurant: restaurantWithImage });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Find all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Query one user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update one user
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password, restaurantName, restaurantCategory } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.restaurantName = restaurantName || user.restaurantName;
    user.restaurantCategory = restaurantCategory || user.restaurantCategory;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.salt = salt;
    }

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
