const express = require('express');
const { register, login } = require('../controllers/authController'); // Import both register and login functions
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');
const adminProtect = require('../middleware/adminProtect'); // Import adminProtect

// Routes
router.post('/register', register); // Register route
router.post('/login', login); // Login route

// Example of a protected route
router.get('/protected', protect, (req, res) => {
  res.status(200).json({ message: 'This is a protected route.', user: req.user });
});
router.get('/profile', protect, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
      if (!user) {
        return res.status(404).json({ message: 'User not found' }); // Handle case when the user is not found
      }
      res.status(200).json(user);
    } catch (err) {
      console.error('Error in /profile:', err.message); // Log the error message
      res.status(500).json({ message: 'Server error' });
    }
  });

router.put('/profile', protect, async (req, res) => {
const { firstName, lastName, email } = req.body;

try {
    const user = await User.findByIdAndUpdate(
    req.user.id,
    { firstName, lastName, email },
    { new: true, runValidators: true } // Return updated document and validate fields
    ).select('-password');

    if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
} catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
}
});
router.get('/admin', protect, adminProtect, (req, res) => {
  res.status(200).json({ message: 'Welcome, admin!' });
});

module.exports = router;
