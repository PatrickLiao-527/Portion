import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    console.log('No token found in cookies');
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    const user = await User.findById(decoded.id).select('-password'); // Fetch user without password

    if (!user) {
      console.log('User not found for token:', decoded.id);
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user; // Attach user to the request object
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

export default authMiddleware;
