const Classes = require('../models/Classes'); // Example schema for chapters and lessons

const getClasses = async (req, res) => {
  console.log("\n🔵 [DEBUG] getClasses function was called!");

  const userId = req.user._id;

  try {
      const classes = await Classes.find().sort({ _id: 1 }); // ✅ Get all classes sorted
      const userProgresses = await UserProgress.find({ userId });

      console.log("User ID:", userId);
      console.log("Total Classes Found:", classes.length);
      console.log("User Progress Records Found:", userProgresses.length);

      // ✅ Convert user progress into a map for easy lookup
      const progressMap = userProgresses.reduce((map, progress) => {
          map[progress.classId.toString()] = progress;
          return map;
      }, {});

      let previousClassCompleted = true;
      const now = new Date();

      const classesWithProgress = classes.map((cls, index) => {
          const progress = progressMap[cls._id.toString()] || {};
          let isUnlocked = false;

          if (index === 0) {
              isUnlocked = true; // ✅ First class should always be unlocked
          } else {
              isUnlocked = previousClassCompleted && 
                          (progress.unlockTime ? new Date(progress.unlockTime) <= now : false);
          }

          // 🚀 If this class is still locked, stop unlocking further classes
          if (!isUnlocked) {
              previousClassCompleted = false;
          }

          console.log(`\n🔹 Class: ${cls.title}`);
          console.log("Class ID:", cls._id.toString());
          console.log("User Progress:", progress);
          console.log("Unlock Time:", progress.unlockTime || "No Unlock Time Set");
          console.log("Is Unlocked?", isUnlocked);

          return {
              _id: cls._id,
              title: cls.title,  // ✅ Ensure title is always included
              lessons: cls.lessons,
              isUnlocked: isUnlocked || false,  // ✅ Ensure it's always `true` or `false`
              userUnlockTime: progress.unlockTime || null,
              completedLessons: progress.completedLessons || [],
              classCompletedAt: progress.classCompletedAt || null,
          };
      });

      res.status(200).json(classesWithProgress);
  } catch (err) {
      console.error("🚨 [ERROR] getClasses failed:", err);
      res.status(500).json({ message: "Server error" });
  }
};

const addClass = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Class title is required." });
  }

  try {
    // ✅ Create new class
    const newClass = new Classes({
      title,
      lessons: [], // ✅ Empty lessons initially
    });

    // ✅ Save class to database
    const savedClass = await newClass.save();

    res.status(201).json({
      message: "Class added successfully!",
      class: savedClass,
    });
  } catch (err) {
    console.error("[ERROR] Error in addClass:", err);
    res.status(500).json({ message: "Server error while adding the class." });
  }
};
// Update class title (Admin only)
const updateClassTitle = async (req, res) => {
  const { classId } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "New title is required." });
  }

  try {
    const updatedClass = await Classes.findByIdAndUpdate(
      classId,
      { title },
      { new: true } // Return updated document
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json({
      message: "Class title updated successfully!",
      updatedClass,
    });
  } catch (err) {
    console.error("[ERROR] Error in updateClassTitle:", err);
    res.status(500).json({ message: "Server error while updating class title." });
  }
};

// Delete class (Admin only)
const deleteClass = async (req, res) => {
  const { classId } = req.params;

  try {
    const deletedClass = await Classes.findByIdAndDelete(classId);

    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json({ message: "Class deleted successfully!" });
  } catch (err) {
    console.error("[ERROR] Error in deleteClass:", err);
    res.status(500).json({ message: "Server error while deleting class." });
  }
};

const addLesson = async (req, res) => {
  const { classId, lessonTitle } = req.body;

  if (!classId || !lessonTitle || !req.file) {
    return res.status(400).json({
      message: "Class ID, lesson title, and a video file are required.",
    });
  }

  try {
    // ✅ Find the class to add the lesson to
    const classData = await Classes.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found." });
    }

    // ✅ Create lesson object
    const lesson = {
      title: lessonTitle,
      content: req.file.path, // ✅ Save the uploaded file path
    };

    // ✅ Add lesson to the class and save
    classData.lessons.push(lesson);
    await classData.save();

    res.status(201).json({
      message: "Lesson added successfully!",
      lesson,
      updatedClass: classData,
    });
  } catch (err) {
    console.error("[ERROR] Error in addLesson:", err);
    res.status(500).json({ message: "Server error while adding the lesson." });
  }
};

// Update lesson content (admin only)
const updateLesson = async (req, res) => {
  const { lessonId } = req.params;
  const { lessonTitle, content } = req.body;

  try {
    // Find the class that contains the lesson
    const classData = await Classes.findOne({ 'lessons._id': lessonId });
    if (!classData) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Find the lesson within the class
    const lesson = classData.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found in the class.' });
    }

    // Update lesson details
    if (lessonTitle) lesson.title = lessonTitle;  // Fixed: Was `lesson.lessonTitle`
    if (content) lesson.content = content;

    // Save the updated class document
    await classData.save();

    res.status(200).json({
      message: "Lesson updated successfully!",
      updatedLesson: lesson,
      updatedClass: classData
    });

  } catch (err) {
    console.error("[ERROR] Error in updateLesson:", err);
    res.status(500).json({ message: 'Server error while updating the lesson.' });
  }
};

module.exports = { updateLesson };

const UserProgress = require("../models/UserProgress"); // Import UserProgress model

const watchLesson = async (req, res) => {
  const { classId, lessonId } = req.body;
  const userId = req.user._id;

  try {
      console.log("[INFO] Fetching class...");
      const currentClass = await Classes.findById(classId);
      if (!currentClass) {
          console.log("[ERROR] Class not found");
          return res.status(404).json({ message: "Class not found." });
      }

      const lesson = currentClass.lessons.find((les) => les._id.toString() === lessonId);
      if (!lesson) {
          console.log("[ERROR] Lesson not found");
          return res.status(404).json({ message: "Lesson not found." });
      }

      // ✅ Mark the lesson as watched
      lesson.watchedAt = new Date();
      await currentClass.save();
      console.log("[INFO] Lesson marked as watched.");

      // ✅ Fetch or create UserProgress for this class
      let userProgress = await UserProgress.findOne({ userId, classId });
      if (!userProgress) {
          console.log("[INFO] Creating new UserProgress document...");
          userProgress = new UserProgress({
              userId,
              classId,
              completedLessons: [],
              unlockTime: null,
          });
      }

      console.log("[INFO] Updating completedLessons...");
      if (!userProgress.completedLessons.some((completedLesson) => completedLesson.lessonId.toString() === lessonId)) {
          userProgress.completedLessons.push({ lessonId, watchedAt: new Date() });
          console.log("[INFO] Lesson added to completedLessons.");
      }

      console.log("[INFO] Checking class completion...");
      const allLessonsWatchedInClass = currentClass.lessons.every((les) =>
          userProgress.completedLessons.some((completedLesson) => completedLesson.lessonId.toString() === les._id.toString())
      );

      if (allLessonsWatchedInClass && !userProgress.classCompletedAt) {
          userProgress.classCompletedAt = new Date();
          console.log("[INFO] Class marked as completed.");

          // ✅ Set unlock time for the NEXT class (personal to the user)
          const nextClass = await Classes.findOne({ _id: { $gt: classId } }).sort({ _id: 1 });

          if (nextClass) {
              console.log("[INFO] Setting unlock time for next class...");
              let nextClassProgress = await UserProgress.findOne({ userId, classId: nextClass._id });
              if (!nextClassProgress) {
                  nextClassProgress = new UserProgress({
                      userId,
                      classId: nextClass._id,
                      completedLessons: [],
                      unlockTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours later
                  });
              } else {
                  nextClassProgress.unlockTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
              }
              await nextClassProgress.save();
              console.log("[INFO] Next class unlockTime set:", nextClassProgress.unlockTime);
          } else {
              console.log("[INFO] No next class to unlock.");
          }
      }

      console.log("[INFO] Saving UserProgress...");
      await userProgress.save();
      console.log("[INFO] UserProgress updated successfully.");

      res.status(200).json({
          message: "Lesson watched successfully.",
          currentLesson: lesson,
          nextClassUnlockTime: userProgress.unlockTime || null,
      });
  } catch (err) {
      console.error("[ERROR] Error in watchLesson:", err);
      res.status(500).json({ message: "Server error while updating lesson." });
  }
};


const resetUserProgress = async (req, res) => {
    const userId = req.user._id; // Extract user ID from the request (assumes `protect` middleware is used)
  
    try {
      // Delete all progress records for the user
      const result = await UserProgress.deleteMany({ userId });
  
      res.status(200).json({
        message: 'User progress has been reset successfully.',
        deletedCount: result.deletedCount,
      });
    } catch (err) {
      console.error('Error resetting user progress:', err);
      res.status(500).json({ message: 'Server error while resetting user progress.' });
    }
  };

module.exports = { getClasses, addLesson, updateLesson, watchLesson, resetUserProgress, addClass, updateClassTitle, deleteClass};
