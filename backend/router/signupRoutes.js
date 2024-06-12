import express from 'express';
import User from '../models/userModel.js';
import Restaurant from '../models/restaurantModel.js'; // Import Restaurant model
import authMiddleware from '../middleware/authMiddleware.js';
import bcrypt from 'bcrypt';

const router = express.Router();

//sign up route 
router.post('/', async (req, res) => {
  try {
    console.log('Received signup data:', req.body); // Log received data
    const { name, email, password, role, restaurantName, restaurantCategory } = req.body;
    if (!email || !password || !name || !role) {
      console.log('Missing fields:', { email, password, name, role });
      return res.status(422).json({ error: 'Submit all fields (email, name, password, role)' });
    }

    const savedUser = await User.findOne({ email });
    if (savedUser) {
      console.log('Email already in use:', email);
      return res.status(422).json({ error: 'Email already in use' });
    }

    const newUser = new User({
      email,
      name,
      password,
      role,
      restaurantName: role === 'owner' ? restaurantName : undefined,
      restaurantCategory: role === 'owner' ? restaurantCategory : undefined
    });

    const createdUser = await newUser.save();
    console.log('User created:', createdUser);

    if (role === 'owner') {
      const newRestaurant = new Restaurant({
        ownerId: createdUser._id,
        name: restaurantName,
        category: restaurantCategory,
        img: null // Assuming there's no image during signup
      });
      await newRestaurant.save();
      console.log('Restaurant created for owner:', newRestaurant);
    }

    res.json({ message: 'User saved successfully' });
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

// Update user profile password
router.put('/profile/password', authMiddleware, async (req, res) => {
  const { newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
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
