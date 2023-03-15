const curriculumService = require('./service');
const courseService = require('../courses/service');

module.exports = {
  // List curriculum
  getAllCurr: async (req, res, next) => {
    try {
      const filter = req.query;
      const curriculum = await curriculumService.findAll(filter);
      return res.status(200).json(curriculum);
    } catch (error) {
      next(error);
    }
  },
  // Read curriculum
  getCurr: async (req, res, next) => {
    try {
      const filter = {_id: req.params.id};
      const curriculum = await curriculumService.find(filter);
      return res.status(200).json(curriculum);
    } catch (error) {
      next(error);
    }
  },
  // Create curriculum
  createCurr: async (req, res, next) => {
    try {
      const curriculum = await curriculumService.create(req.body);
      await courseService.update(req.body.courses, {$inc: {total_lesson: 1}});
      return res.status(200).json(curriculum);
    } catch (error) {
      next(error);
    }
  },
  // Update curriculum
  updateCurr: async (req, res, next) => {
    try {
      const condition = {_id: req.params.id};
      const doc = req.body;
      const option = {new: true};
      const curriculum = await curriculumService.update(condition, doc, option);
      return res.status(200).json(curriculum);
    } catch (error) {
      next(error);
    }
  },
  // Remove curriculum
  removeCurr: async (req, res, next) => {
    try {
      const condition = {_id: req.params.id};
      const curriculum = await curriculumService.remove(condition);
      await courseService.update(curriculum.courses, {$inc: {total_lesson: -1}});
      res.status(200).json(curriculum);
    } catch (error) {
      next(error);
    }
  },
};
