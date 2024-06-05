import { Decimal128 } from 'mongodb';
import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  carbsPrice: {
    type: Decimal128,
    required: true
  },
  proteinType: {
    type: String,
    required: true
  },
  proteinsPrice: {
    type: Decimal128,
    required: true
  },
  baseFat: {
    type: Decimal128,
    required: true
  },
  itemPicture: {
    type: String,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
