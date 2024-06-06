import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { PORT, mongoDBURL } from "./config.js";
import ordersRoute from "./router/ordersRoutes.js";
import menusRoute from "./router/menusRoutes.js";
import transactionsRoute from "./router/transactionsRoutes.js";
import signupRoute from "./router/signupRoutes.js";
import authRoute from "./router/authRoutes.js";
import restaurantRoute from "./router/restaurantRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'], // Specify multiple origins in an array
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type'],
  credentials: true 
}));

app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Returned status 234');
});

app.use('/signup', signupRoute);
app.use('/auth', authRoute);  
app.use('/orders', ordersRoute);
app.use('/menus', menusRoute);
app.use('/transactions', transactionsRoute);
app.use('/restaurants', restaurantRoute);

mongoose
  .connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
