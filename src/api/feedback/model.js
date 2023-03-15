const {default: mongoose} = require('mongoose');
const {ObjectId} = mongoose.Schema;

const feedBackSchema = new mongoose.Schema(
  {
    paidClass: {
      type: ObjectId,
      ref: 'paidClass',
    },
    project: {
      type: String,
    },
    rate: {
      type: Number,
    },
    comment: {
      type: String,
    },
  },
  {collection: 'feedbacks', timestamps: true}
);

module.exports = mongoose.model('feedbacks', feedBackSchema);
