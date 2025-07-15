import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  // Email is now optional and not unique
  email: { type: String, required: false, sparse: true }, 
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Role' },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) { 
  return await bcrypt.compare(enteredPassword, this.password); 
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { 
    next(); 
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;