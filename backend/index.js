import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
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

// Use dotenv config
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
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
app.get('/', (req, res) => {
  console.log(req);
  return res.status(234).send('Returned status 234');
});

// Route setup
app.use('/signup', signupRoute);
app.use('/auth', authRoute);  
app.use('/orders', ordersRoute);
app.use('/menus', menusRoute);
app.use('/transactions', transactionsRoute);
app.use('/restaurants', restaurantRoute);
app.use('/categories', categoryRoutes);
app.use('/contact', contactRoutes);

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
