import express from 'express';
import Order from '../models/orderModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // check column integrity
        const schemaPaths = Order.schema.paths;
        const columnNames = Object.keys(schemaPaths).filter(
            col_name => col_name !== '_id' && col_name !== '__v' && schemaPaths[col_name].isRequired
        );
        columnNames.forEach(col_name => {
            console.log(req.body);
            if (col_name !== 'orderID' && !req.body.hasOwnProperty(col_name)) {
                return res.status(400).send({
                    message: `Error: Send all required fields, missing ${col_name}`
                });
            }
        });
        
        // create and add to database
        const newOrder = { ...req.body };
        const order = await Order.create(newOrder);
        
        return res.status(201).send(order);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({});
        return res.status(200).json({
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
})


// query by id
router.get('/:id', async (req, res) => {
    try {
        const queryOrder = await Order.findOne({ 'orderId': req.body.orderId });
        return res.status(200).json({
            data: orders
        });
    } catch {
        return res.status(500).send({ message: error.message });
    }
})


export default router;