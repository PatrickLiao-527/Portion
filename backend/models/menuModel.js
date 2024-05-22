import { Binary, Decimal128 } from 'mongodb';
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
  proteinsPrice: {
    type: Decimal128,
    required: true
  },
  baseFat: {
    type: Decimal128,
    required: true
  },
  itemPicture: {
    type: Buffer,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
