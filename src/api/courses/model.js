const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    fee: {
      type: Number,
      required: true,
      trim: true,
    },
    total_lesson: {
      type: Number,
      trim: true,
      default: 0,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {collection: 'courses', timestamps: true}
);

module.exports = mongoose.model('course', CourseSchema);
