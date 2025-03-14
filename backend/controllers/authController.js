import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "sdfoliskfdglsdbfgsdsdf",
      { expiresIn: "1h" }
    );
    return res.json({ message: "Login successful", token, role: user.role });
  } 
  catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }


};
  // Get All Users (Name, Email, Phone Number)
  export const getAllUsers = async (req, res) => {
    try {
      // Only allow admin users to view all users
      const users = await User.find(); // You can include more fields here
      res.json(users);
    } 
    catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  };


