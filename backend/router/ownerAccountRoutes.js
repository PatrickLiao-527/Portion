import express from 'express';
import Owner from '../models/ownerModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Signup route for owners
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(422).json({ error: 'Submit all fields (email, name, password, restaurantIds)' });
    }

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(422).json({ error: 'Email already in use' });
    }

    const newOwner = new Owner({ name, email, password });
    const createdOwner = await newOwner.save();

    const token = jwt.sign({ id: createdOwner._id }, 'your_jwt_secret_key', { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict'
    });

    res.status(201).json({ owner: createdOwner, token, message: 'Owner saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get owner profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const owner = await Owner.findById(req.user._id);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.json(owner);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update owner profile password
router.put('/profile/password', authMiddleware, async (req, res) => {
  const { newPassword } = req.body;
  try {
    const owner = await Owner.findById(req.user._id);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const salt = await bcrypt.genSalt(10);
    owner.password = await bcrypt.hash(newPassword, salt);
    await owner.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Find all owners
router.get('/', async (req, res) => {
  try {
    const owners = await Owner.find({});
    res.json(owners);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Query one owner by id
router.get('/:id', async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.json(owner);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update one owner
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password, restaurantIds } = req.body;
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    owner.name = name || owner.name;
    owner.email = email || owner.email;
    owner.restaurantIds = restaurantIds || owner.restaurantIds;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      owner.password = await bcrypt.hash(password, salt);
    }

    await owner.save();
    res.json({ message: 'Owner updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete owner
router.delete('/:id', async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    await owner.remove();
    res.json({ message: 'Owner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
