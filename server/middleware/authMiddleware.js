const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token

  console.log("Authorization Header:", req.headers.authorization); // Debugging

  if (!token) {
    console.log("Token Missing");
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Fetch the user from the database
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      console.log("User not found for ID:", decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    // Proceed to the next middleware or controller
    next();
  } catch (err) {
    console.error("Authorization error:", err);
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired' });
      console.error("Authorization error:", err.message);
    }
    return res.status(403).json({ message: 'Token invalid or expired' });
  }

};


module.exports = protect;
