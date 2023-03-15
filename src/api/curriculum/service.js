const _curriculum = require('./model');

module.exports = {
  findAll: async (filter) => {
    const curriculum = await _curriculum
      .find({...filter, is_deleted: {$ne: true}})
      .populate('courses');
    return curriculum;
  },
  find: async (filter) => {
    const curriculum = await _curriculum.findOne(filter).populate('courses');
    return curriculum;
  },
  update: async (condition, doc, option) => {
    const curriculum = await _curriculum.findOneAndUpdate(condition, doc, option);
    return curriculum;
  },
  remove: async (condition) => {
    const curriculum = await _curriculum.findOneAndUpdate(
      condition,
      {is_deleted: true},
      {new: true}
    );
    return curriculum;
  },
  create: async (data) => {
    const curriculum = await _curriculum.create(data);
    return curriculum;
  },
};
