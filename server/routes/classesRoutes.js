const express = require('express');
const multer = require('multer');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminProtect');
const UserProgress = require('../models/UserProgress'); // Import the UserProgress model
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config(); // Ensure environment variables are loaded

const {
  watchLesson,
  getClasses,
  addLesson,
  addClass,
  updateClassTitle,
  deleteClass,
  updateLesson,
} = require('../controllers/classesController'); // Importing required controllers
const Classes = require('../models/Classes'); // Importing the Classes model

// ✅ Configure Multer for Local File Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // ✅ Save files in the 'uploads/' directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // ✅ Unique filenames
//   },
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ✅ Save files in 'uploads/'
  },
  filename: (req, file, cb) => {
    // ✅ Remove spaces and special characters
    const safeFilename = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    cb(null, `${Date.now()}-${safeFilename}`);
  },
});


// ✅ Set Maximum File Size to 2GB
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // ✅ 2GB Limit
});

//const upload = multer({ storage }); // Initialize multer with storage configuration

// Add user progress tracking to fetch classes
router.get('/my-classes', protect, getClasses);


router.post('/watch-lesson', protect, watchLesson);

// Existing routes
router.post("/add-lesson", protect, adminProtect, upload.single("video"), addLesson);
//router.post("/add-lesson", protect, adminProtect, upload.single("video"), addLesson); // ✅ Use imported function

// Add route to reset user progress
router.delete('/reset-progress', protect, async (req, res) => {
  const { resetUserProgress } = require('../controllers/classesController');
  await resetUserProgress(req, res);
});

router.delete('/delete-lesson/:lessonId', protect, adminProtect, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const updatedClass = await Classes.findOneAndUpdate(
      { 'lessons._id': lessonId },
      { $pull: { lessons: { _id: lessonId } } },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json({ message: 'Lesson deleted successfully!', updatedClass });
  } catch (err) {
    console.error('[ERROR] Deleting Lesson:', err);
    res.status(500).json({ message: 'Server error while deleting lesson.' });
  }
});

router.post('/add-class', protect, adminProtect, addClass);
router.put('/update-class/:classId', protect, adminProtect, updateClassTitle);
router.delete('/delete-class/:classId', protect, adminProtect, deleteClass);

router.get('/', protect, getClasses);
//router.post('/add-chapter', protect, adminProtect, addChapter);
router.put('/update-lesson/:lessonId', protect, adminProtect, updateLesson);

module.exports = router;
