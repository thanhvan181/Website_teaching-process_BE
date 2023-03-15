const courseService = require('./service');

module.exports = {
  createCourse: async (req, res, next) => {
    try {
      const course = await courseService.create(req.body);
      return res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  },
  getAllCourses: async (req, res, next) => {
    try {
      const courses = await courseService.getAll();
      return res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  },
  getCourse: async (req, res, next) => {
    try {
      const course = await courseService.get(req.params.id);
      return res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  },
  removeCourse: async (req, res, next) => {
    try {
      const course = await courseService.remove(req.params.id);
      return res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  },
  updateCourse: async (req, res, next) => {
    try {
      const course = await courseService.update(req.params.id, req.body);
      return res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  },
};
