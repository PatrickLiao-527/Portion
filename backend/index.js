import express from "express";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import ordersRoute from "./router/ordersRoute.js";

const app = express();

app.use(express.json());

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Returned status 234');
});

app.use('/orders', ordersRoute);
app.use();

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
