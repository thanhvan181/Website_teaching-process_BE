const paidService = require('./service');
const teacherService = require('../teachers/service');
const {sendEmail} = require('../../helpers/email');
const {sendMessageSlack} = require('../../helpers/slack-app');
const {getDateByDay, loopSchedule, sortDateOrder} = require('../../helpers/date');
const ApiError = require('../../helpers/ApiError');
const {STATUS_SESSIONS, STATUS_PAID_CLASS} = require('../../constants/status');
const {WEEKENDS} = require('../../constants');
const {capitalizeFirstLetter} = require('../../helpers/text');
const dayjs = require('dayjs');

module.exports = {
  getAllPaid: async (req, res, next) => {
    try {
      const filter = req.query;
      const paidClasses = await paidService.findAll(filter);
      return res.status(200).json(paidClasses);
    } catch (error) {
      next(error);
    }
  },
  getPaid: async (req, res, next) => {
    try {
      const filter = {_id: req.params.id};
      const paidClass = await paidService.find(filter);
      return res.status(200).json(paidClass);
    } catch (error) {
      next(error);
    }
  },
  getStartDatePaidClass: async (req, res, next) => {
    try {
      dateStart = getDateByDay(req.body);
      return res.status(200).json(dateStart);
    } catch (error) {
      next(new ApiError(422, error));
    }
  },
  getPaidClassForStudent: async (req, res, next) => {
    try {
      const filter = {student: {_id: req.params.student}};
      let paidClasses = await paidService.findAll(filter);
      paidClasses = paidClasses.map((item) => {
        const newSchedule = item.schedule.filter((itm) => itm.status == (1 || 2));
        return {...item.toObject(), schedule: newSchedule.reverse()};
      });
      return res.status(200).json(paidClasses);
    } catch (error) {
      next(new ApiError(422, error));
    }
  },
  createPaid: async (req, res, next) => {
    try {
      let {schedule, start_date, course, teacher, student} = req.body;
      const hasPaidClass = await paidService.find({
        student: {_id: student},
        status: STATUS_PAID_CLASS.WAIT_PAID,
      });

      if (hasPaidClass) throw 'Học sinh đang theo học khóa học khác';

      let {paidBookedSlots, name, link} = await teacherService.find({_id: teacher});
      const paidSlotIds = [];
      schedule = paidBookedSlots.filter((item) => {
        let check = false;
        schedule.forEach((itm) => {
          if (itm == item._id.toString()) {
            check = true;
          }
        });
        return check;
      });

      schedule = schedule.map((item) => {
        paidSlotIds.push(item._id);
        return {slot: item.slot._id.toString(), day: item.day};
      });

      const finalSchedule = await loopSchedule(schedule, start_date, course);
      req.body = {
        ...req.body,
        schedule: finalSchedule,
      };
      const response = await paidService.create(req.body);
      await Promise.all(
        paidSlotIds.map(async (item) => {
          await teacherService.update(
            {'paidBookedSlots._id': item},
            {$set: {'paidBookedSlots.$.is_booked': true}}
          );
        })
      );

      //SEND EMAIL
      const replacements = {
        username: response.student[0].name,
        teacher: name,
        link: link,
        schedule: 'https://student.brightchamps.click/schedule',
      };
      const options = {
        to: response.student[0].email,
        subject: 'Thông báo lịch học',
      };
      await sendEmail(replacements, options, 'emailCreatePaidClass.html');

      const content =
        'Bạn mới nhận được lớp học mới, vui lòng kiểu tra lại lịch dạy để không bỏ lỡ thông tin buổi học';
      await sendMessageSlack(response, content);
      return res.status(200).json(response);
    } catch (error) {
      next(new ApiError(422, error));
    }
  },
  updatePaid: async (req, res, next) => {
    try {
      const condition = {_id: req.params.id};
      const doc = req.body;
      const option = {new: true};
      const paidClass = await paidService.update(condition, doc, option);
      return res.status(200).json(paidClass);
    } catch (error) {
      next(error);
    }
  },
  updateSchedulePaid: async (req, res, next) => {
    try {
      const {_id, sessionId, content} = req.body;
      const option = {new: true};
      const paidClass = await paidService.find({_id: _id});
      const teacher = await teacherService.find({_id: paidClass.teacher._id});
      const sessions = paidClass.schedule.find((item) => item._id == sessionId);
      const newDate = content.date.split('/').reverse();
      let schedule = await paidService.findAll({
        student: {_id: paidClass.student[0]._id},
      });
      schedule = schedule.map((item) => item.schedule);
      const inValid = schedule.flat().some((item) => {
        return (
          item.slot._id == content.slot && content.date == dayjs(item.date).format('DD/MM/YYYY')
        );
      });
      if (inValid) {
        throw 'Lịch học bị trùng !';
      }
      const newSessions = {
        slot: teacher.paidBookedSlots.find((item) => item._id == content.slot).slot._id,
        day: capitalizeFirstLetter(WEEKENDS[new Date(newDate.join('-')).getDay()]),
        date: new Date(new Date(sessions.date).setFullYear(newDate[0], newDate[1] - 1, newDate[2])),
        status: STATUS_SESSIONS.PENDING,
        curriculum: sessions.curriculum._id.toString(),
      };

      const newValue = await paidService.update(
        {_id: _id},
        {$push: {schedule: newSessions}},
        option
      );

      const result = await sortDateOrder(newValue.schedule);

      await paidService.update({_id: _id}, {schedule: result}, option);
      await paidService.update(
        {schedule: {$elemMatch: {_id: sessionId}}},
        {$set: {'schedule.$.status': STATUS_SESSIONS.REJECT}},
        option
      );

      // SEND EMAIL
      const replacements = {
        username: paidClass.student[0].name,
        teacher: teacher.name,
        course: paidClass.course.courseName,
        before: sessions.slot.text + ' ngày ' + dayjs(sessions.date).format('DD/MM/YYYY'),
        after:
          teacher.paidBookedSlots.find((item) => item._id == content.slot).slot.text +
          ' ngày ' +
          dayjs(newSessions.date).format('DD/MM/YYYY'),
        link: paidClass.link,
        schedule: 'https://student.brightchamps.click/schedule',
      };
      const options = {
        to: paidClass.student[0].email,
        subject: 'Thông báo thay đổi lịch học',
      };
      await sendEmail(replacements, options, 'emailChangeSchedule.html');
      const contentSl =
        'Lịch dạy của bạn vừa thay đổi, vui lòng kiểm tra lại lịch dạy để không bỏ lỡ thông tin buổi dạy';
      await sendMessageSlack({teacher: teacher._id}, contentSl);

      return res.status(200).json({status: 'success'});
    } catch (error) {
      next(new ApiError(422, error));
    }
  },
  removePaid: async (req, res, next) => {
    try {
      let {paidClass} = req.body;
      if (paidClass && !Array.isArray(paidClass)) {
        paidClass = [paidClass];
      }
      paidClass.forEach(async (id) => {
        const condition = {_id: id};
        await paidService.remove(condition);
      });
      res.status(200).json({status: 'success'});
    } catch (error) {
      next(error);
    }
  },
};
