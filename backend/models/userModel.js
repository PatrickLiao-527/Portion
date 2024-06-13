import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'client'],
    required: true,
    default: 'client'
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const saltRounds = 10;
  await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {

  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Error during password comparison:', error);
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

export default User;
