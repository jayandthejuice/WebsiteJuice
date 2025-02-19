// require('dotenv').config(); // Load environment variables
// const express = require('express'); // Import Express
// const cors = require('cors'); // Import CORS middleware
// const connectDB = require('./config/db'); // Import MongoDB connection
// const authRoutes = require('./routes/authRoutes'); // Import auth routes
// const classesRoutes = require('./routes/classesRoutes');

// const path = require('path'); // Import path module for static file handling

// // Initialize Express app
// const app = express();
// const cloudinary = require("cloudinary").v2;

// // ✅ Configure Cloudinary with Secure Credentials
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// console.log("✅ Cloudinary Config Loaded!");

// // Middleware
// app.use(express.json()); // Parse incoming JSON requests
// // ✅ Increase request limits (set to 3GB just in case)
// app.use(express.json({ limit: "3000mb" })); 
// app.use(express.urlencoded({ limit: "3000mb", extended: true }));

// //app.use(cors()); // Enable CORS for cross-origin requests
// app.use(cors({
//   origin: "*", // Replace with your frontend URL for better security
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization", "Range"], // Allow Range for video streaming
//   exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"], // Expose headers needed for playback
// }));
// const fs = require("fs");

// // ✅ Check if "uploads" directory exists (to prevent errors)
// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }
// const multer = require("multer");
// const storage = multer.memoryStorage(); // Store file in memory for Cloudinary upload
// const upload = multer({ storage });

// app.post("/upload", upload.single("video"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Upload video to Cloudinary
//     const result = await cloudinary.uploader.upload_stream(
//       { resource_type: "video" },
//       (error, video) => {
//         if (error) {
//           console.error("Cloudinary Upload Error:", error);
//           return res.status(500).json({ message: "Error uploading to Cloudinary" });
//         }
//         res.json({ videoUrl: video.secure_url });
//       }
//     ).end(req.file.buffer);
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ message: "Error uploading video" });
//   }
// });

// // Routes
// app.use('/api/auth', authRoutes); // Define the auth route
// app.use('/api/classes', classesRoutes); // My Classes route

// // Connect to MongoDB
// connectDB();
// console.log("✅ Auth routes loaded");

// app.get('/api/test', (req, res) => {
//   res.json({ message: "Backend is working!" });
// });

// // Start the server
// //const PORT = process.env.PORT || 5001; // Use PORT from .env or default to 5000
// const PORT = process.env.PORT || 10000; // Use PORT from .env or default to 5000
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
require("dotenv").config(); // Load environment variables
const express = require("express"); // Import Express
const cors = require("cors"); // Import CORS middleware
const connectDB = require("./config/db"); // Import MongoDB connection
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const classesRoutes = require("./routes/classesRoutes"); // Import classes routes
const multer = require("multer"); // File upload middleware
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream"); // Required for Cloudinary upload stream

// Initialize Express app
const app = express();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("✅ Cloudinary Config Loaded!");

// Middleware
app.use(express.json({ limit: "3GB" })); // ✅ Increase request limits
app.use(express.urlencoded({ limit: "3GB", extended: true }));

// ✅ Enable CORS
app.use(
  cors({
    origin: "*", // Replace with your frontend URL for better security
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Range"], // Allow Range for video streaming
    exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"], // Expose headers needed for playback
  })
);

// ✅ Configure Multer for memory storage (Cloudinary Upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Convert Buffer to Readable Stream for Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "lessons" },
      (error, video) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ message: "Error uploading to Cloudinary" });
        }
        res.json({ videoUrl: video.secure_url });
      }
    );

    // Pipe the buffer to Cloudinary
    Readable.from(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error uploading video" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/classes", classesRoutes);

// Connect to MongoDB
connectDB();
console.log("✅ Auth routes loaded");

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
