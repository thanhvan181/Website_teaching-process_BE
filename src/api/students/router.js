const express = require('express');
const studentController = require('./controller');

const studentRouter = express.Router();

studentRouter.get('/', studentController.getAllStudents);
studentRouter.get('/:id', studentController.getStudent);
studentRouter.post('/', studentController.createStudent);
studentRouter.delete('/:id', studentController.removeStudent);
studentRouter.patch('/:id', studentController.updateStudent);
studentRouter.get('/:id/schedule', studentController.getAllSchedule);

module.exports = studentRouter;
