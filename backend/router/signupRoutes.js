import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password || !name) {
            return res.status(422).json({ error: 'Submit all fields (email, name, password)' });
        }

        const savedUser = await User.findOne({ email: email });
        if (savedUser) {
            return res.status(422).json({ error: 'Email already in use' });
        }

        const newUser = new User({
            email,
            name,
            password
        });

        const user = await newUser.save();
        res.json({ message: 'User saved successfully' });
    } catch (err) {
        console.log(err);
    };
});

// find all users
router.get('/', async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// query one user by id
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

// update one user
router.put('/:id', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
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

// delete user
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