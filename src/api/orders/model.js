const {boolean} = require('joi');
const mongoose = require('mongoose');
const {STATUS_ORDER} = require('../../constants/status');
const {ObjectId} = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    studentGrade: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    schedule: {
      slots: {
        type: ObjectId,
        ref: 'slots',
      },
      date: {
        type: String,
      },
    },
    listApply: {
      type: [ObjectId],
      ref: 'teachers',
      default: [],
    },
    status: {
      type: Number,
      enum: Object.values(STATUS_ORDER),
      default: STATUS_ORDER.WAIT_CONFIRM,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {collection: 'orders', timestamps: true}
);

const _orders = mongoose.model('orders', OrderSchema);
module.exports = _orders;
