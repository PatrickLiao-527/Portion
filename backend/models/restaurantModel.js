import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false 
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    ref: 'Category',
    required: true
  },
  img: {
    type: Buffer,
    required: false
  }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
