const _students = require('./model');

const userService = {
  create: (data) => {
    const student = _students.create(data);
    return student;
  },
  getAll: () => {
    const students = _students.find({is_deleted: {$ne: true}});
    return students;
  },
  get: (id) => {
    const student = _students.findById(id);
    return student;
  },
  remove: (id) => {
    const student = _students.findByIdAndUpdate(id, {is_deleted: true}, {new: true});
    return student;
  },
  update: (id, data) => {
    const student = _students.findByIdAndUpdate(id, data, {new: true});
    return student;
  },
};

module.exports = userService;
