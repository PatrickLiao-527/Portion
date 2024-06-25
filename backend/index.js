import { PORT, mongoDBURL } from './config.js';
import ordersRoute from './router/ordersRoutes.js';
import menusRoute from './router/menusRoutes.js';
import transactionsRoute from './router/transactionsRoutes.js';
import signupRoute from './router/signupRoutes.js';
import authRoute from './router/authRoutes.js';
import restaurantRoute from './router/restaurantRoutes.js';
import categoryRoutes from './router/categoryRoutes.js';
import contactRoutes from './router/contactUsRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';


// Use dotenv config
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware setup
app.use(cors({
  origin: [
      'http://localhost:3001', 
      'http://localhost:3000',
      'http://107.175.133.12:3001',
      'http://107.175.133.12:3000',
      'portion.food',
      'www.portion.food'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Get __dirname equivalent in ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route for testing
app.get('/api', (req, res) => {
  console.log(req);
  return res.status(234).send('Returned status 234');
});

// Route setup
app.use('/api/signup', signupRoute);
app.use('/api/auth', authRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/menus', menusRoute);
app.use('/api/transactions', transactionsRoute);
app.use('/api/restaurants', restaurantRoute);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
