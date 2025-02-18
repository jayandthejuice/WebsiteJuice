// const mongoose = require('mongoose');

// const LessonSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String, // Can be text, URL, or markdown
//     required: true,
//   },
//   watchedAt: {
//     type: Date, // Timestamp for when the lesson was watched
//     default: null, // Default to null if not watched
//   },
// });

// const ChapterSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   lessons: [LessonSchema], // Array of lessons
//   unlockTime: {
//     type: Date, // Timestamp for when the chapter becomes available
//     default: null, // Default to null for no restriction
//   },
//   isUnlocked: {
//     type: Boolean, // Indicates if the chapter is unlocked
//     default: false, // Default to false, locked by default
//   },
// });

// const ClassesSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     chapters: [ChapterSchema], // Array of chapters
//   },
//   {
//     timestamps: true, // Automatically add createdAt and updatedAt fields
//   }
// );

// module.exports = mongoose.model('Classes', ClassesSchema);
const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String, // Can be a video URL, text, etc.
    required: true,
  },
  watchedAt: {
    type: Date, // Timestamp for when the lesson was watched
    default: null,
  }
});

const ClassesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A class must have a title"], // ✅ Ensure title is required
    },
    lessons: [LessonSchema], // ✅ Lessons directly inside classes
    unlockTime: {
      type: Date, // Unlock time for the next class
      default: null,
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

module.exports = mongoose.model('Classes', ClassesSchema);
