const mongoose = require('mongoose');
const {STATUS_PAID_CLASS, STATUS_SESSIONS} = require('../../constants/status');

const {ObjectId} = mongoose.Schema;

const PaidClassSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    course: {
      type: ObjectId,
      ref: 'course',
    },
    teacher: {
      type: ObjectId,
      ref: 'teachers',
    },
    student: {
      type: [ObjectId],
      ref: 'students',
      required: true,
    },
    paid_manager: {
      type: ObjectId,
      ref: 'paidManagers',
    },
    link: {
      type: String,
      required: true,
    },
    schedule: [
      {
        slot: {
          type: ObjectId,
          ref: 'slots',
        },
        day: {
          type: String,
          default: 'Sunday',
        },
        date: {
          type: Date,
          default: Date.now(),
        },
        status: {
          type: Number,
          enum: Object.values(STATUS_SESSIONS),
          default: STATUS_SESSIONS.PENDING,
        },
        curriculum: {
          type: ObjectId,
          ref: 'curriculum',
        },
        feedback: {
          type: ObjectId,
          ref: 'feedbacks',
        },
      },
    ],
    start_date: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: Number,
      enum: Object.values(STATUS_PAID_CLASS),
      default: STATUS_PAID_CLASS.WAIT_PAID,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {collection: 'paidClass', timestamps: true}
);

module.exports = mongoose.model('paidClass', PaidClassSchema);
