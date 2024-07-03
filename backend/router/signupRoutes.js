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
  console.log(`Uploaded new image: ${saveTo}`);
  return `${id}${extension}`;
};

const deleteOldImage = (id) => {
  const extensions = validImageExtensions;
  for (const ext of extensions) {
    const filePath = path.join('uploads', `${id}.${ext}`);
    console.log(`trying to find old image path${filePath}`)
    if (fs.existsSync(filePath)) {
      console.log(`Deleting old image: ${filePath}`);
      fs.unlinkSync(filePath);
      return filePath;
    }
  }
  console.log('No old image found to delete');
  return null;
};

const getImageBase64 = (id, extension) => {
  const filePath = path.join('uploads', `${id}${extension}`);
  if (fs.existsSync(filePath)) {
    console.log(`Fetching image: ${filePath}`);
    return fs.readFileSync(filePath, 'base64');
  }
  return null;
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


// Signup route
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, restaurantName, restaurantCategory } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(422).json({ error: 'Submit all fields (email, name, password, role)' });
    }

    if (role === 'owner' && (!restaurantName || !restaurantCategory)) {
      return res.status(422).json({ error: 'Owners must specify restaurant name and category' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ error: 'Email already in use' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      restaurantName: role === 'owner' ? restaurantName : undefined,
      restaurantCategory: role === 'owner' ? restaurantCategory : undefined
    });

    const createdUser = await newUser.save();

    // Generate token
    const token = jwt.sign({ id: createdUser._id, role: createdUser.role }, 'your_jwt_secret_key', { expiresIn: '1h' });

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: 'Strict'
    });

    res.status(201).json({ user: createdUser, token, message: 'User saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



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

    let restaurant = await Restaurant.findOne({ ownerId: user._id });
    if (!restaurant) {
      restaurant = new Restaurant({ ownerId: user._id, name: restaurantName, category: restaurantCategory });
    } else {
      restaurant.name = restaurantName || restaurant.name;
      restaurant.category = restaurantCategory || restaurant.category;
    }

    let newImageExtension = null;
    if (fileBuffer.length > 0) {
      // Delete old image if it exists
      const oldImagePath = deleteOldImage(restaurant._id.toString());
      if (oldImagePath) {
        console.log(`Old image deleted: ${oldImagePath}`);
      } else {
        console.log('No old image found to delete');
      }

      // Upload new image
      const fileName = await handleFileUpload(fileBuffer, restaurant._id.toString());
      newImageExtension = fileName.split('.').pop(); // Set the new image extension

      restaurant.img = fileName; // Update the restaurant document with the new image path
      restaurant.imgExtension = newImageExtension; 

      console.log(`New image uploaded and updated in database: ${fileName}`);
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    user.restaurantName = restaurant.name; // Ensure user restaurantName is updated

    await restaurant.save();
    await user.save();

    // Fetch the latest image info using the same logic as get /restaurants
    const extension = newImageExtension || validImageExtensions.find(ext => fs.existsSync(path.join('uploads', `${restaurant._id}.${ext}`)));
    const imageBase64 = extension ? getImageBase64(restaurant._id, `.${extension}`) : null;

    const restaurantWithImage = {
      ...restaurant.toObject(),
      img: imageBase64,
      imgExtension: extension
    };

    console.log('Updated profile with image:', {
      restaurantId: restaurant._id,
      imgExtension: restaurantWithImage.imgExtension
    });

    res.json({ message: 'Profile updated successfully', user, restaurant: restaurantWithImage });
    broadcast('profileUpdated', { user, restaurant: restaurantWithImage });
  } catch (err) {
    console.error('Error updating profile:', err.message);
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
    const imageInfo = restaurant ? getImageBase64(restaurant._id) : null;

    if (imageInfo) {
      console.log(`Fetched image for restaurant ${restaurant._id}: ${imageInfo.extension}`);
    } else {
      console.log(`No image found for restaurant ${restaurant._id}`);
    }

    const restaurantWithImage = restaurant ? {
      ...restaurant.toObject(),
      img: imageInfo ? imageInfo.data : null,
      imgExtension: imageInfo ? imageInfo.extension : null
    } : null;

    console.log('Fetched profile with image:', restaurantWithImage);
    res.json({ user, restaurant: restaurantWithImage });
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ error: 'Internal server error' });
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

    const imageInfo = getImageBase64(restaurant._id);
    res.status(200).json({ ...restaurant.toObject(), img: imageInfo ? imageInfo.data : null, imgExtension: imageInfo ? imageInfo.extension : null });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get menu items for a specific restaurant
router.get('/:restaurantId/menu-items', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const menuItems = await Menu.find({ ownerId: restaurantId });

    const menuItemsWithImages = menuItems.map(menuItem => {
      const imageInfo = getImageBase64(menuItem._id);
      return {
        ...menuItem.toObject(),
        image: imageInfo ? imageInfo.data : null,
        imageExtension: imageInfo ? imageInfo.extension : null
      };
    });

    return res.status(200).json({ length: menuItemsWithImages.length, data: menuItemsWithImages });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
