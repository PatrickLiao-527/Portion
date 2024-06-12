import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  carbsPrice: { type: Number, required: true },
  proteinsPrice: { type: Number, required: true },
  baseFat: { type: Number, required: true },
  proteinType: { 
    type: String, 
    required: true,
    enum: [
      "Chicken Breast", "Chicken Thigh", "Chicken Wing", "Chicken Drumstick", 
      "Beef Sirloin", "Beef Ribeye", "Pork Loin", "Pork Belly", "Pork Chops", 
      "Salmon", "Tuna", "Cod", "Shrimp", "Crab", "Lobster", "Scallops", 
      "Tilapia", "Halibut", "Duck Breast", "Lamb Chops"
    ]
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
