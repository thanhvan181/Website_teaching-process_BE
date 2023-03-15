const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: '',
      unique: true,
      required: true,
    },
    start: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    end: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {collection: 'slots', timestamps: true}
);

module.exports = mongoose.model('slots', SlotSchema);
