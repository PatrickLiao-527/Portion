import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Please provide email, password, and role' });
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

    // Check role
    if (user.role !== role) {
      console.log('Unauthorized access attempt by user:', email, user.role);
      return res.status(403).json({ error: 'Access denied. Unauthorized role.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: 'Strict'
    });

    res.status(200).json({ user, token });
  } catch (err) {
    console.error('Error during login process:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  if (typeof token !== 'string') {
    console.error('Invalid token format:', token);
    return res.status(400).json({ error: 'Invalid token format' });
  }

  console.log('Received Google token:', token); // Debugging line

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('Google token payload:', payload); // Debugging line

    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: name,
        email: email,
        role: 'client', // Default role for client
      });

      user = await user.save();
      console.log('User created:', user);
    } else {
      console.log('User already exists:', user);

      // Check if user already has a role, if not assign the default role
      if (!user.role) {
        user.role = 'client';
        await user.save();
      }
    }

    const authToken = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });

    res.cookie('token', authToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'Strict'
    });

    res.status(200).json({ user, token: authToken });
  } catch (err) {
    console.error('Error during Google login process:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get a user's role by email
router.get('/role/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ role: user.role });
  } catch (err) {
    console.error('Error fetching user role:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Route to delete a user by email
router.delete('/delete-user', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check whether the user is logged in
router.get('/check', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
