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

//app.use(cors()); // Enable CORS for cross-origin requests
// ✅ Enable CORS
app.use(cors({
  origin: "*", // Allow all origins (or set a specific frontend URL)
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
const fs = require("fs");

// ✅ Check if "uploads" directory exists (to prevent errors)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// ✅ Serve static files properly
app.use("/uploads", express.static("uploads"));

// ✅ Custom Route to Handle MOV & MP4 Files Correctly
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  // ✅ Set correct content type for streaming
  if (filePath.endsWith(".mov")) {
    res.setHeader("Content-Type", "video/quicktime");
  } else if (filePath.endsWith(".mp4")) {
    res.setHeader("Content-Type", "video/mp4");
  }

  res.setHeader("Content-Disposition", "inline"); // Stream instead of download
  res.sendFile(filePath);
});
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
