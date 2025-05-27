import {User} from'../models/User.js';
import {generateToken, verifyToken} from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
  const { name, email, password, address, latitude, longitude } = req.body;

  try {
    // Check if user exists and is not soft-deleted
    const existingUser = await User.findOne({ email, is_deleted: false });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Create new user with all fields
    const user = await User.create({
      name,
      email,
      password,
      address: address || '',
      latitude: latitude || null,
      longitude: longitude || null,
      status: 'active',
    });

    res.status(201).json({
      message: 'User registered successfully',
      data:{
      name: user.name,
      email: user.email,
      address: user.address,
      latitude: user.latitude,
      longitude: user.longitude,
      status: user.status,
      register_at: user.createdAt,
      token: generateToken(user._id),
    }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user who is not soft-deleted
    const user = await User.findOne({ email, is_deleted: false });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      data:{
      // _id: user._id,
      name: user.name,
      email: user.email,
      // address: user.address,
      // latitude: user.latitude,
      // longitude: user.longitude,
      // status: user.status,
      // register_at: user.createdAt,
      // updatedAt: user.updatedAt,
      token: generateToken(user._id),
    }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export { 
  register, 
  login, 
};
