const feedbackService = require('./service');
const paidService = require('../paidClass/service');
const demoService = require('../demoClass/service');
const {STATUS_SESSIONS} = require('../../constants/status');
const ApiError = require('../../helpers/ApiError');

module.exports = {
  // List feedbacks
  getAllFeedbacks: async (req, res, next) => {
    try {
      const filter = req.query;
      const feedbacks = await feedbackService.findAll(filter);
      return res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  },
  // Read feedbacks
  getFeedback: async (req, res, next) => {
    try {
      const filter = {_id: req.params.id};
      const feedback = await feedbackService.find(filter);
      return res.status(200).json(feedback);
    } catch (error) {
      next(error);
    }
  },
  // Create feedbacks
  createFeedback: async (req, res, next) => {
    try {
      const option = {new: true};
      const feedback = await feedbackService.create(req.body);
      await paidService.update(
        {schedule: {$elemMatch: {_id: req.query.sessionId}}},
        {
          $set: {
            'schedule.$.status': !req.body.absent
              ? STATUS_SESSIONS.RESOLVE
              : STATUS_SESSIONS.ABSENT,
            'schedule.$.feedback': feedback._id,
          },
        },
        option
      );
      await demoService.update(
        {schedule: {$elemMatch: {_id: req.query.sessionId}}},
        {
          $set: {
            'schedule.$.status': !req.body.absent
              ? STATUS_SESSIONS.RESOLVE
              : STATUS_SESSIONS.ABSENT,
            'schedule.$.feedback': feedback._id,
          },
        },
        option
      );

      return res.status(200).json(feedback);
    } catch (error) {
      next(new ApiError(422, error));
    }
  },
  // Update feedbacks
  updateFeedback: async (req, res, next) => {
    try {
      const condition = {_id: req.params.id};
      const doc = req.body;
      const option = {new: true};
      const feedback = await feedbackService.update(condition, doc, option);
      return res.status(200).json(feedback);
    } catch (error) {
      next(error);
    }
  },
  // Remove feedbacks
  removeFeedback: async (req, res, next) => {
    try {
      const condition = {_id: req.params.id};
      const feedback = await feedbackService.remove(condition);
      res.status(200).json(feedback);
    } catch (error) {
      next(error);
    }
  },
};
