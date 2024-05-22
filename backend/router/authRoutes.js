import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';


const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    // check all fields not empty
    if (!email || !password) return res.status(400).json({ error: 'Please provide both email and password' });
    
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ error: 'email and password does not match or don\'t exist' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: 'internal server error' });
    }
});

export default router;