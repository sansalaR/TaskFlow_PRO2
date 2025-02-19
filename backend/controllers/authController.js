import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

export const register = async (req, res) => {
  
  const { username, email, phoneNumber, role, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) 
      {
      return res.status(400).json({ message: "Username already taken" });
    }
    if (!username || !email || !phoneNumber || !password) {
      // 400 Bad Request
      return res.status(400).json({ message: "All fields are required" });
    }
    // check password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      username,
      email,
      phoneNumber,
      role:role || 'user',
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) 
  {
    return res.status(500).json({ message: "Error registering user", error });
  }
};