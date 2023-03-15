const express = require('express');
const teacherService = require('./controller');

const router = express.Router();

router.get('/paidBookedSlots', teacherService.getPaidBookedSlots);
router.get('/', teacherService.getAllTeachers);
router.get('/:id', teacherService.getTeacher);
router.get('/:id/schedule', teacherService.getAllSchedule);
router.get('/:id/paidBookedSlots', teacherService.getTeacherPaidBookedSlots);
router.get('/:id/demo-class', teacherService.getListDemoClassCanApply);
router.post('/', teacherService.createTeacher);
router.delete('/:id', teacherService.removeTeacher);
router.patch('/:id', teacherService.updateTeacher);
router.put('/:id', teacherService.updateTeacher);

module.exports = router;
