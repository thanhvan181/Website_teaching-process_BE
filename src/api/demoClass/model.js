const {string} = require('joi');
const mongoose = require('mongoose');
const {STATUS_DEMO_CLASS, STATUS_SESSIONS} = require('../../constants/status');

const {ObjectId} = mongoose.Schema.Types;

const DemoClassSchema = new mongoose.Schema(
  {
    teacher: {
      type: ObjectId,
      ref: 'teachers',
    },
    student: {
      type: ObjectId,
      ref: 'orders',
      required: true,
    },
    saleman: {
      type: ObjectId,
      ref: 'users',
      required: true,
    },
    status: {
      type: Number,
      enum: Object.values(STATUS_DEMO_CLASS),
      default: STATUS_DEMO_CLASS.NO_TEACHER,
    },
    link: {
      type: String,
    },
    schedule: [
      {
        slot: {
          type: ObjectId,
          ref: 'slots',
        },
        date: {
          type: Date,
        },
        day: {
          type: String,
          required: true,
        },
        status: {
          type: Number,
          enum: Object.values(STATUS_SESSIONS),
          default: STATUS_SESSIONS.PENDING,
        },
        feedback: {
          type: ObjectId,
          ref: 'feedbacks',
        },
      },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {collection: 'demoClass', timestamps: true}
);

module.exports = mongoose.model('demoClass', DemoClassSchema);
