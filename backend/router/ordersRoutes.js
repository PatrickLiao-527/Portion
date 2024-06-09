import express from 'express';
import Order from '../models/orderModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/checkRole.js';
import { broadcast } from '../websocket.js';
const router = express.Router();

// Create new order -> Now public and uses websocket for notification pushing 
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    broadcast({ type: 'NEW_ORDER', order: newOrder });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Get all orders for the authenticated user (owner only)
router.get('/', authMiddleware, checkRole('owner'), async (req, res) => {
  try {
    const orders = await Order.find({ ownerId: req.user._id });
    res.status(200).json(orders);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific order by ID (owner only)
router.get('/:id', authMiddleware, checkRole('owner'), async (req, res) => {
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
    console.log(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an order by ID (owner only)
router.put('/:id', authMiddleware, checkRole('owner'), async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this order' });
    }

    Object.assign(order, req.body);
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an order by ID (owner only)
router.delete('/:id', authMiddleware, checkRole('owner'), async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this order' });
    }

    await order.remove();

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Route to change order status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log('Received order ID:', id); // Log received order ID
  console.log('Received status:', status); // Log received status

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();
    console.log(`changing status for order ${order}`);
    res.status(200).json(order); // Return the updated order
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
