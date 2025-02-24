import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phoneNumber: { 
    type: Number, 
    required: true, 
  },

  // 'admin' or 'user'
  role: { 
    type: String, 
    enum: ["user", "admin"],
    default: "user", 
  }, 
  
  password: { 
    type: String, 
    required: true,
    unique: true 
  },
  
});

const User = mongoose.model('User', userSchema);

export default User;
