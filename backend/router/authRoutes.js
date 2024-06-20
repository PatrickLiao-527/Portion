import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

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

    if (user.role !== 'owner' && user.role!== "client") {
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

// Google login route
router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token using Google's OAuth2Client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture: profilePic } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      // If user does not exist, create a new user
      user = new User({
        name: name,
        email: email,
        role: 'owner'
      });

      user = await user.save();
      console.log('User created:', user);
    } else {
      console.log('User already exists:', user);
    }

    if (user.role !== 'owner') {
      console.log('Unauthorized access attempt by user:', email);
      return res.status(403).json({ error: 'Access denied. Unauthorized role.' });
    }

    const authToken = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });

    // Set token in HTTP-only cookie
    res.cookie('token', authToken, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: 'Strict'
    });

    res.status(200).json({ user, token: authToken });
  } catch (err) {
    console.error('Error during Google login process:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check whether the user is logged in
router.get('/check', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Logout route to clear the user's cookies and log out
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
