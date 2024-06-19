import express from 'express';
import User from '../models/userModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { broadcast } from '../websocket.js';

const router = express.Router();



// Signup route
router.post('/', async (req, res) => {
  try {
    console.log('Received signup data:', req.body);
    const { name, email, password, role, restaurantName, restaurantCategory } = req.body;

    if (!email || !password || !name || !role) {
      console.log('Missing fields:', { email, password, name, role });
      return res.status(422).json({ error: 'Submit all fields (email, name, password, role)' });
    }

    if (role === 'owner' && (!restaurantName || !restaurantCategory)) {
      return res.status(422).json({ error: 'Owners must specify restaurant name and category' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already in use:', email);
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
    console.log('User created:', createdUser);

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
    console.log('Error during signup:', err);
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
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, restaurantName, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name || user.name;
    user.restaurantName = restaurantName || user.restaurantName;

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });

    // Broadcast the profile update event
    broadcast('profileUpdated', user);
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
