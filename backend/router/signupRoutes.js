import express from 'express';
import User from '../models/userModel.js';
import Owner from '../models/ownerModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

router.post('/owner', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check fields all filled
    const schemaPaths = Transaction.schema.paths;
    const columnNames = Object.keys(schemaPaths).filter(
        col_name => col_name !== '_id' && col_name !== '__v' && schemaPaths[col_name].isRequired
    );
    for (const col_name of columnNames) {
      if (!req.body.hasOwnProperty(col_name)) {
          return res.status(400).json({
              message: `Error: Send all required fields, missing ${col_name}`
          });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already in use:', email);
      return res.status(422).json({ error: 'Email already in use' });
    }

    const newOwner = new Owner({
      name,
      email,
      password
    });

    const createdOwner = await newOwner.save();
    console.log('User created:', createdOwner);

    // Generate token
    const token = jwt.sign({ id: createdOwner._id }, 'your_jwt_secret_key', { expiresIn: '24h' });

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: 'Strict'
    });

    res.status(201).json({ user: createdOwner, token, message: 'User saved successfully' });
  } catch (err) {
    console.log('Error during signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/client', async (req, res) => {
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
      password
    });

    const createdUser = await newUser.save();
    console.log('User created:', createdUser);

    // Generate token
    const token = jwt.sign({ id: createdUser._id, role: createdUser.role }, 'your_jwt_secret_key', { expiresIn: '24h' });

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

router.delete('/owner/:id', async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ error: 'User not found' });
    }

    await owner.remove();
    res.json({ message: 'Owner deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
