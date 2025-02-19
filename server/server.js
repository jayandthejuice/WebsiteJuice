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

// ✅ Stream Video Files Properly
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // ✅ Handle Range Requests for streaming
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send("Requested range not satisfiable\n");
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": filePath.endsWith(".mov") ? "video/quicktime" : "video/mp4",
      "Content-Disposition": "inline", // ✅ Make sure it's inline
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    // ✅ Serve the full file with streaming headers
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": filePath.endsWith(".mov") ? "video/quicktime" : "video/mp4",
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store",
      "Content-Disposition": "inline", // ✅ Force inline viewing
    });

    fs.createReadStream(filePath).pipe(res);
  }
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
