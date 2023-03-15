const express = require('express');
const courseControllers = require('./controller');

const router = express.Router();

router.post('/', courseControllers.createCourse);
router.get('/', courseControllers.getAllCourses);
router.get('/:id', courseControllers.getCourse);
router.delete('/:id', courseControllers.removeCourse);
router.put('/:id', courseControllers.updateCourse);

module.exports = router;
