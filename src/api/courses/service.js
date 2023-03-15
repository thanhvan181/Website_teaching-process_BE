const _courses = require('./model');

module.exports = {
  getAll: () => {
    const courses = _courses.find({ is_deleted: { $ne: true } });
    return courses;
  },
  get: (id) => {
    const courses = _courses.findById(id);
    return courses;
  },
  create: (data) => {
    const course = _courses.create(data);
    return course;
  },
  update: (id, data) => {
    const course = _courses.findByIdAndUpdate(id, data, { new: true });
    return course;
  },
  remove: (id) => {
    const course = _courses.findByIdAndUpdate(id, { is_deleted: true }, { new: true });
    return course;
  },
};
