const _teacher = require('./model');

module.exports = {
  findAll: async (filter) => {
    const filterOptions = {
      is_deleted: {$ne: filter.deleted && filter.deleted.toLowerCase() === 'yes' ? false : true},
      ...filter,
    };
    const teachers = await _teacher
      .find(filterOptions)
      .populate('demoBookedSlots.slot')
      .populate('paidBookedSlots.slot')
      .exec();
    return teachers;
  },
  find: async (filter) => {
    const teacher = await _teacher
      .findOne(filter)
      .populate('demoBookedSlots.slot')
      .populate('paidBookedSlots.slot')
      .exec();
    return teacher;
  },
  update: async (condition, doc, option) => {
    const teacher = await _teacher.findOneAndUpdate(condition, doc, option);
    return teacher;
  },
  remove: async (condition) => {
    const teacher = await _teacher.findOneAndUpdate(condition, {is_deleted: true}, {new: true});
    return teacher;
  },
  create: async (data) => {
    const teacher = await _teacher.create(data);
    return teacher;
  },
};
