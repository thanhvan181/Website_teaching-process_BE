const studentService = require('./service');
const paidClassService = require('../paidClass/service');
const {sortDateOrder} = require('../../helpers/date');
const {STATUS_SESSIONS} = require('../../constants/status');

const studentController = {
  createStudent: async (req, res, next) => {
    try {
      const student = await studentService.create(req.body);
      return res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  },
  getAllStudents: async (req, res, next) => {
    try {
      const students = await studentService.getAll();
      return res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  },
  getStudent: async (req, res, next) => {
    try {
      const student = await studentService.get(req.params.id);
      return res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  },
  removeStudent: async (req, res, next) => {
    try {
      const student = await studentService.remove(req.params.id);
      return res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  },
  updateStudent: async (req, res, next) => {
    try {
      const student = await studentService.update(req.params.id, req.body);
      return res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  },
  getAllSchedule: async (req, res, next) => {
    try {
      const condition = {student: req.params.id};
      const dateFilter = [
        new Date(new Date().setHours(0, 0, 0)),
        new Date(
          new Date(
            new Date().setDate(new Date().getDate() + (Number(req.query.date) || 30))
          ).setHours(0, 0, 0)
        ),
      ];
      if (Number(req.query.date) < 0) dateFilter.reverse();
      let response = await paidClassService.findAll(condition);
      let newRes = [];
      response.forEach((item) => {
        const newSchedule = item.schedule;
        item = {
          code: item.code,
          course: {
            courseName: item.course.courseName,
            total_lesson: item.course.total_lesson,
          },
          students: item.student,
          teacher: item.teacher,
          link: item.link,
          idClass: item._id,
        };
        newSchedule.forEach((itm) => {
          newRes.push({...itm.toObject(), ...item});
        });
      });
      const result = sortDateOrder(newRes).filter((item) => {
        const dateItm = Date.parse(new Date(new Date(item.date).setHours(0, 0, 0)));
        if (Number(req.query.date) < 0) {
          return (
            Date.parse(dateFilter[0]) <= dateItm &&
            dateItm < Date.parse(dateFilter[1]) &&
            item.status != STATUS_SESSIONS.REJECT
          );
        } else {
          return (
            Date.parse(dateFilter[0]) <= dateItm &&
            dateItm <= Date.parse(dateFilter[1]) &&
            item.status != STATUS_SESSIONS.REJECT
          );
        }
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = studentController;
