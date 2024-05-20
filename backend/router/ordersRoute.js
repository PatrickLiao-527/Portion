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
            if (!req.body.hasOwnProperty(col_name)) {
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
        response.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({});
        return res.status(200).json({
            length: orders.length,
            data: orders
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});


// query by id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params;
        const queryOrder = await Order.findById(id);
        return res.status(200).json({
            data: queryOrder
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
    }
});

// update by id
router.put('/books/:id', async (req, res) => {
    try {
        // check column(param) integrity
        const schemaPaths = Order.schema.paths;
        const columnNames = Object.keys(schemaPaths).filter(
            col_name => col_name !== '_id' && col_name !== '__v' && schemaPaths[col_name].isRequired
        );
        columnNames.forEach(col_name => {
            console.log(req.body);
            if (!req.body.hasOwnProperty(col_name)) {
                return res.status(400).send({
                    message: `Error: Send all required fields, missing ${col_name}`
                });
            }
        });

        const { id } = request.params;

        const result = await Order.findByIdAndUpdate(id, req.body);

        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        console.log(err.message);
        response.status(500).json({ message: err.message })
    }
})

// delete by id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Order.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

export default router;