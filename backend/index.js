import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import { PORT, mongoDBURL } from "./config.js";
import ordersRoute from "./router/ordersRoutes.js";
import menusRoute from "./router/menusRoutes.js";
import transcationsRoute from "./router/transactionsRoutes.js";
import signupRoute from "./router/signupRoutes.js";

const app = express();

app.use(express.json());

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Returned status 234');
});

app.use('/signup', signupRoute);
app.use('/orders', ordersRoute);
app.use('/menus', menusRoute);
app.use('/transcations', transcationsRoute);

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
