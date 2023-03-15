const {string} = require('joi');
const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema;

const TeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    fullName: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: 'Vietnam',
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    languages: {
      type: String,
      default: 'Vietnamese',
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    demoBookedSlots: [
      {
        slot: {
          type: ObjectId,
          ref: 'slots',
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    paidBookedSlots: [
      {
        slot: {
          type: ObjectId,
          ref: 'slots',
        },
        day: {
          type: String,
          default: 'Sunday',
        },
        is_booked: {
          type: Boolean,
          default: false,
        },
      },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    link: {
      type: String,
      default: '',
    },
  },
  {collection: 'teachers', timestamps: true}
);

module.exports = mongoose.model('teachers', TeacherSchema);
