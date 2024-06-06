import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret_key', { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict'
    });

    res.status(200).json({ user, token });
  } catch (err) {
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
