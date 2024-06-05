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
    enum: ['Online', 'In Person'] // Assuming payment type can be either online or InPerson
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
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealName: {
    type: String,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  proteins: {
    type: Number,
    required: true
  },
  fats: {
    type: Number,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
