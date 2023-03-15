const _feedback = require('./model');
_feedback;

module.exports = {
  findAll: async (filter) => {
    const feedbacks = await _feedback
      .find({...filter, is_deleted: {$ne: true}})
      .populate('student');
    return feedbacks;
  },
  find: async (filter) => {
    const feedback = await _feedback.findOne(filter).populate('student');
    return feedback;
  },
  update: async (condition, doc, option) => {
    const feedback = await _feedback.findOneAndUpdate(condition, doc, option);
    return feedback;
  },
  remove: async (condition) => {
    const feedback = await _feedback.findOneAndUpdate(condition, {is_deleted: true}, {new: true});
    return feedback;
  },
  create: async (data) => {
    const feedback = await _feedback.create(data);
    return feedback;
  },
};
