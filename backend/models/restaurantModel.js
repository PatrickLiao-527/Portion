import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true 
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  img: {
    type: Buffer,
    required: false
  }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
