import express from 'express';
import Order from '../models/orderModel.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    // Check column integrity
    const schemaPaths = Order.schema.paths;
    const columnNames = Object.keys(schemaPaths).filter(
      col_name => col_name !== '_id' && col_name !== '__v' && schemaPaths[col_name].isRequired
    );
    for (const col_name of columnNames) {
      if (!req.body.hasOwnProperty(col_name)) {
        return res.status(400).send({
          message: `Error: Send all required fields, missing ${col_name}`
        });
      }
    }

    // Create and add to database
    const newOrder = { ...req.body, ownerId: req.user._id }; // Set ownerId from authenticated user
    const order = await Order.create(newOrder);

    return res.status(201).send(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ ownerId: req.user._id });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order by id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Check column(param) integrity
    const schemaPaths = Order.schema.paths;
    const columnNames = Object.keys(schemaPaths).filter(
      col_name => col_name !== '_id' && col_name !== '__v' && schemaPaths[col_name].isRequired
    );
    for (const col_name of columnNames) {
      if (!req.body.hasOwnProperty(col_name)) {
        return res.status(400).send({
          message: `Error: Send all required fields, missing ${col_name}`
        });
      }
    }

    const { id } = req.params;

    const result = await Order.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Delete order by id
router.delete('/:id', authMiddleware, async (req, res) => {
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
