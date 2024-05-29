import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Please provide both email and password' });

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });
        
        // Set the cookie with HttpOnly and Secure attributes
        res.cookie('token', token, {
            httpOnly: true, // Accessible only by the web server
            secure: true,   // Ensures the cookie is sent only over HTTPS
            sameSite: 'Strict', // Prevents CSRF attacks
        });

        res.status(200).json({ message: 'Authentication successful' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
