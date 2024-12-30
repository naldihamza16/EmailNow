import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";


dotenv.config();

// controllers/authController.js
export const signup = async (req, res) => {
  try {
    const { name, lastName, phone, email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Create a new user
    const newUser = new User({
      name,
      lastName,
      phone,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully!',
      user: { id: newUser._id, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET, // Store the secret in an environment variable
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

