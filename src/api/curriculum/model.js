const {string} = require('joi');
const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema;

const CurriculumSchema = new mongoose.Schema(
  {
    lesson: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    courses: {
      type: ObjectId,
      ref: 'course',
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {collection: 'curriculum', timestamps: true}
);

module.exports = mongoose.model('curriculum', CurriculumSchema);
