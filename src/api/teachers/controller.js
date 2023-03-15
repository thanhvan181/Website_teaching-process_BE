const teacherService = require('./service');
const paidClassService = require('../paidClass/service');
const demoClassService = require('../demoClass/service');
const {sortDateOrder} = require('../../helpers/date');
const {STATUS_DEMO_CLASS, STATUS_SESSIONS} = require('../../constants/status');

module.exports = {
  // List teachers
  getAllTeachers: async (req, res, next) => {
    try {
      const filter = req.query;
      const teachers = await teacherService.findAll(filter);
      return res.status(200).json(teachers);
    } catch (error) {
      next(error);
    }
  },
  // Read teacher
  getTeacher: async (req, res, next) => {
    try {
      const filter = {_id: req.params.id};
      const teacher = await teacherService.find(filter);
      return res.status(200).json(teacher);
    } catch (error) {
      next(error);
    }
  },
  getPaidBookedSlots: async (req, res, next) => {
    try {
      const teachers = await teacherService.findAll();
      return res.status(200).json(
        teachers.map((item) => {
          const teacher = {
            name: item.name,
            email: item.email,
            paidBookedSlots: item.paidBookedSlots,
          };
          return teacher;
        })
      );
    } catch (error) {
      next(error);
    }
  },
  getTeacherPaidBookedSlots: async (req, res, next) => {
    try {
      const filter = {_id: req.params.id};
      const {name, email, paidBookedSlots: schedule} = await teacherService.find(filter);
      return res.status(200).json({
        name,
        email,
        schedule,
      });
    } catch (error) {
      next(error);
    }
  },
  // Create teacher
  createTeacher: async (req, res, next) => {
    try {
      const teacher = await teacherService.create(req.body);
      return res.status(200).json(teacher);
    } catch (error) {
      next(error);
    }
  },
  // Update teacher
  updateTeacher: async (req, res, next) => {
    try {
      const condition = {_id: req.params.id};
      const doc = req.body;
      const option = {new: true};
      const teacher = await teacherService.update(condition, doc, option);
      return res.status(200).json(teacher);
    } catch (error) {
      next(error);
    }
  },
  // Remove teacher
  removeTeacher: async (req, res, next) => {
    try {
      const condition = {_id: req.params.id};
      const teacher = await teacherService.remove(condition);
      res.status(200).json(teacher);
    } catch (error) {
      next(error);
    }
  },
  getAllSchedule: async (req, res, next) => {
    try {
      const condition = {teacher: req.params.id};
      const dateFilter = [
        new Date(new Date().setHours(0, 0, 0)),
        new Date(
          new Date(
            new Date().setDate(new Date().getDate() + (Number(req.query.date) || 30))
          ).setHours(0, 0, 0)
        ),
      ];
      if (Number(req.query.date) < 0) dateFilter.reverse();
      let paidClass = await paidClassService.findAll(condition);
      let demoClass = await demoClassService.findAll(condition);

      const response = paidClass.concat(demoClass);
      let newRes = [];
      response.forEach((item) => {
        const newSchedule = item.schedule;
        item = {
          code: item?.code || 'Demo Class',
          course: {
            courseName: item.course?.courseName || 'Demo Class',
            total_lesson: item.course?.total_lesson || 1,
          },
          idClass: item._id,
          students: [
            {
              _id: item.student[0]?._id || item.student._id,
              name: item.student[0]?.name || item.student.studentName,
              email: item.student[0]?.email || item.student.email,
              phone: item.student[0]?.phone || item.student.phone,
              gender: item.student[0]?.gender || 'Empty',
              country: item.student[0]?.country || 'Empty',
            },
          ],
          teacher: item.teacher,
          link: item.link,
        };
        newSchedule.forEach((itm) => {
          itm.curriculum = itm?.curriculum || {};
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

  getListDemoClassCanApply: async (req, res, next) => {
    try {
      const demoClass = await demoClassService.findAll({status: STATUS_DEMO_CLASS.NO_TEACHER});
      const arrDate = [];
      const dateFilter = [
        new Date(new Date().setHours(0, 0, 0)),
        new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(0, 0, 0)),
      ];
      let result = sortDateOrder(demoClass).filter((item) => {
        const date = Date.parse(new Date(new Date(item.schedule[0].date).setHours(0, 0, 0)));
        return Date.parse(dateFilter[0]) <= date && date <= Date.parse(dateFilter[1]);
      });

      for (let i = 0; i < 3; i++) {
        arrDate.push(new Date(new Date().setDate(new Date().getDate() + i)).getDate());
      }
      result = arrDate.map((item) => {
        const flag = [];
        result.forEach((itm) => {
          if (new Date(itm.schedule[0].date).getDate() == item) {
            flag.push(itm);
          }
        });
        return flag;
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
