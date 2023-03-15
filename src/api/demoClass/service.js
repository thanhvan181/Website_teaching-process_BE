const _demoClass = require('./model');

module.exports = {
  findAll: async (filter) => {
    const demoClasses = await _demoClass
      .find(filter)
      .populate('teacher')
      .populate({path: 'student', populate: [{path: 'schedule.slots'}, {path: 'listApply'}]})
      .populate('schedule.slot');
    return demoClasses;
  },
  find: async (filter) => {
    const demoClass = await _demoClass
      .findOne(filter)
      .populate('teacher')
      .populate({path: 'student', populate: [{path: 'schedule.slots'}, {path: 'listApply'}]})
      .populate('schedule.slot');
    return demoClass;
  },
  update: async (condition, doc, option) => {
    const demoClass = await _demoClass.findOneAndUpdate(condition, doc, option);
    return demoClass;
  },
  remove: async (condition) => {
    const demoClass = await _demoClass.findOneAndUpdate(condition, {is_deleted: true}, {new: true});
    return demoClass;
  },
  create: async (data) => {
    const demoClass = await _demoClass.create(data);
    return demoClass;
  },
};
