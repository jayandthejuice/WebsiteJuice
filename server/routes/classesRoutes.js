const express = require('express');
const multer = require('multer');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminProtect');
const UserProgress = require('../models/UserProgress'); // Import the UserProgress model
const { CloudinaryStorage } = require("multer-storage-cloudinary");


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

// ✅ Configure Cloudinary Storage for Videos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lesson_videos", // ✅ Videos will be stored in Cloudinary under this folder
    resource_type: "video",
  },
});

// Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Directory to save uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filenames
//   },
// });
const multer = require("multer");

// ✅ Set the max file size to 2GB (2 * 1024 * 1024 * 1024 bytes)
const upload = multer({ storage });


//router.post("/add-lesson", protect, adminProtect, upload.single("video"), addLesson);


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
