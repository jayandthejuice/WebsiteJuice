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
// ✅ Increase request limits (set to 3GB just in case)
app.use(express.json({ limit: "3000mb" })); 
app.use(express.urlencoded({ limit: "3000mb", extended: true }));

app.use(cors()); // Enable CORS for cross-origin requests
const fs = require("fs");

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ 'uploads/' directory created.");
}

app.use("/uploads", express.static(uploadDir)); // Serve uploaded files

//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const cloudinary = require("cloudinary").v2;

// ✅ Configure Cloudinary with Secure Credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("✅ Cloudinary Config Loaded!");

// Routes
app.use('/api/auth', authRoutes); // Define the auth route
app.use('/api/classes', classesRoutes); // My Classes route

// Connect to MongoDB
connectDB();
console.log("✅ Auth routes loaded");

app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Start the server
//const PORT = process.env.PORT || 5001; // Use PORT from .env or default to 5000
const PORT = process.env.PORT || 10000; // Use PORT from .env or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
