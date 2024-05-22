import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  time: {  // in js time format, which is unix time * 1000
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
  },
  ownerId:{
    type: String,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
