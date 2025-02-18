const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a user
const register = async (req, res) => {
    const { firstName, lastName, email, password, role = 'user' } = req.body; // Default role is user
  
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters, include 1 uppercase letter, and 1 special character.',
      });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role, // Include the role in the user document
      });
  
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Login as a user
// Login function in authController.js
const login = async (req, res) => {
  console.log("🛠 Received login request:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("❌ Missing email or password");
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password for:", email);
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Ensure role is included in the token payload
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include role in token
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );
    console.log("✅ Login successful for:", email);
    console.log("Generated Token:", token);

    console.log("Generated Token Payload:", { id: user._id, role: user.role }); // Debug log

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role, // Include role here
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

  
  module.exports = { login };
  
  

// Export both functions
module.exports = { register, login };
