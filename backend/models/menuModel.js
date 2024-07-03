import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  carbsPrice: { type: Number, required: true },
  carbsPortion: { type: String, required: true },
  carbsType: { 
    type: String, 
    required: true,
    enum: [
      "Brown Rice", "Quinoa", "Sweet Potato", "Whole Wheat Pasta", "Oats", 
      "Barley", "Buckwheat", "Chickpeas", "Lentils", "Farro", "Millet", 
      "Spelt", "Wild Rice", "Black Beans", "Kidney Beans", "Green Peas",
      "Whole Grain Bread", "Bulgur", "Couscous", "White Rice", "Pasta", 
      "Potato", "Corn", "Bread"
    ]
  },
  proteinsPrice: { type: Number, required: true },
  proteinsPortion: { type: String, required: true },
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
  allergicInfo: {
    type: [
      {
        type: String,
        enum: [
          "Milk", "Eggs", "Fish", "Crustacean shellfish", "Tree nuts", 
          "Peanuts", "Wheat", "Soybeans", "Sesame", "Gluten-Free", "Vegan", 
          "Vegetarian", "Sugar-Free", "Low Sodium", "Low Fat", "Low Carb", 
          "Caffeine-Free", "Organic", "Non-GMO", "Dairy-Free", "Nut-Free", 
          "Kosher", "Halal", "No Artificial Sweeteners", "No Preservatives"
        ]
      }
    ],
    required: true
  },
  ingredientList: [
    {
      ingredientName: { type: String, required: true },
      caloriesPerGram: { type: Number, required: true },
      gramsUsed: { type: Number, required: true }
    }
  ],
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemPicture: { type: String }
});

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
