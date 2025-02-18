require('dotenv').config(); // Load environment variables
const express = require('express'); // Import Express
const cors = require('cors'); // Import CORS middleware
const connectDB = require('./config/db'); // Import MongoDB connection
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const classesRoutes = require('./routes/classesRoutes');

const path = require('path'); // Import path module for static file handling

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for cross-origin requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes); // Define the auth route
app.use('/api/classes', classesRoutes); // My Classes route

// Connect to MongoDB
connectDB();

// Start the server
//const PORT = process.env.PORT || 5001; // Use PORT from .env or default to 5000
const PORT = process.env.PORT || 10000; // Use PORT from .env or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
