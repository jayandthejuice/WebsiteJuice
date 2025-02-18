// const mongoose = require('mongoose');

// const UserProgressSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   classId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Classes',
//     required: true,
//   },
//   completedLessons: [
//     {
//       lessonId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Lesson',
//       },
//       watchedAt: Date,
//     },
//   ],
//   completedChapters: [
//     {
//       chapterId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Chapter',
//       },
//       completedAt: Date,
//     },
//   ],
//   classCompletedAt: Date, // Tracks when the entire class is completed
//   unlockTime: Date, // User-specific unlock time for the next class
// });

// module.exports = mongoose.model('UserProgress', UserProgressSchema);
const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classes',
    required: true,
  },
  completedLessons: [
    {
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
      watchedAt: Date,
    },
  ],
  classCompletedAt: Date, // When the full class is completed
  unlockTime: Date, // User-specific unlock time for the next class
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);
