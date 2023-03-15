const demoService = require('./service');
const teacherService = require('../teachers/service');
const slotService = require('../slots/service');
const orderService = require('../orders/service');
const {WEEKENDS} = require('../../constants');
const {capitalizeFirstLetter} = require('../../helpers/text');
const {STATUS_ORDER, STATUS_DEMO_CLASS} = require('../../constants/status');
const {sendEmail} = require('../../helpers/email');
const {sendMessageSlack} = require('../../helpers/slack-app');

const handleAfterAddTeacher = async (req, idTeacher) => {
  //SEND EMAIL
  const {schedule} = req.body;
  const teacherInfo = await teacherService.find({_id: idTeacher});
  const slotInfo = await slotService.get({_id: schedule.slot});
  const replacements = {
    username: req.body.studentName,
    teacher: teacherInfo.name,
    link: teacherInfo.link,
    schedule:
      slotInfo.text +
      ' ' +
      capitalizeFirstLetter(WEEKENDS[new Date(req.body.schedule.date).getDay()]),
  };
  const options = {
    to: req.body.email,
    subject: 'Thông báo xác nhận đăng ký học Demo',
  };
  await sendEmail(replacements, options, 'emailCreateDemoClass.html');
  const content =
    'Bạn mới nhận được lớp học thử mới, vui lòng kiểu tra lại lịch dạy để không bỏ lỡ thông tin buổi học';
  await sendMessageSlack(idTeacher, content);
};

module.exports = {
  // List demoClasss
  getAllDemo: async (req, res, next) => {
    try {
      const filter = req.query;
      const demoClasses = await demoService.findAll(filter);
      return res.status(200).json(demoClasses);
    } catch (error) {
      next(error);
    }
  },
  // Read demoClass
  getDemo: async (req, res, next) => {
    try {
      const filter = {_id: req.params.id};
      const demoClass = await demoService.find(filter);
      return res.status(200).json(demoClass);
    } catch (error) {
      next(error);
    }
  },
  // Create demoClass
  createDemo: async (req, res, next) => {
    try {
      req.body.schedule.day = capitalizeFirstLetter(
        WEEKENDS[new Date(req.body.schedule.date).getDay()]
      );
      if (req.body.teacher) {
        req.body.status = STATUS_DEMO_CLASS.PENDING;
        await handleAfterAddTeacher(req, req.body.teacher);
      }
      await demoService.create(req.body);
      await orderService.update(req.body.student, {status: STATUS_ORDER.CONFIRMED});
      return res.status(200).json({status: 'success'});
    } catch (error) {
      next(error);
    }
  },
  // Update demoClass
  updateDemo: async (req, res, next) => {
    try {
      const condition = {_id: req.params.id};
      const doc = req.body;
      const option = {new: true};
      const {teacher} = await demoService.find(condition);
      if (teacher != doc.teacher) {
        doc.status = STATUS_DEMO_CLASS.PENDING;
        await handleAfterAddTeacher(req, doc.teacher);
      }
      const demoClass = await demoService.update(condition, doc, option);
      return res.status(200).json(demoClass);
    } catch (error) {
      next(error);
    }
  },
  // Remove demoClass
  removeDemo: async (req, res, next) => {
    try {
      const condition = {_id: req.params.id};
      const demoClass = await demoService.remove(condition);
      res.status(200).json(demoClass);
    } catch (error) {
      next(error);
    }
  },
};
