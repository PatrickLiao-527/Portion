import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Owner from '../models/ownerModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret_key', { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict'
    });

    res.status(200).json({ user, token });
  } catch (err) {
    console.error('Error during login process:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/owner/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password' });
  }

  try {
    const owner = await Owner.findOne({ email });
    if (!owner) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordMatch = await owner.matchPassword(password);
    if (!isPasswordMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: owner._id }, 'your_jwt_secret_key', { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict'
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during login process:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// checks whether the user has logged in 
router.get('/check', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
// clears user's cookies info and logs out 
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
