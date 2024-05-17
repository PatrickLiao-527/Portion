import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: uuidv4
  },
  customerName: {
    type: String,
    required: true
  },
// date should be intergrated to time as UNIX time
//   date: {
//     type: Date,
//     required: true
//   },
  time: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentType: {
    type: String,
    required: true,
    enum: ['Online', 'Offline'] // Assuming payment type can be either online or offline
  },
  status: {
    type: String,
    required: true,
    enum: ['Complete', 'In Progress', 'Cancelled'] // Assuming these are the possible statuses
  },
  details: {
    type: String,
    required: false
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
