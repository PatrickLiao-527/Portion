import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
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
    enum: ['Credited', 'Debited'] // Assuming payment type can be either credited or debited
  },
  details: {
    type: String,
    required: false
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
