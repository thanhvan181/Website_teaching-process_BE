const express = require('express');
const feedbackService = require('./controller');

const router = express.Router();

router.get('/', feedbackService.getAllFeedbacks);
router.get('/:id', feedbackService.getFeedback);
router.post('/', feedbackService.createFeedback);
router.delete('/:id', feedbackService.removeFeedback);
router.patch('/:id', feedbackService.updateFeedback);

module.exports = router;
