const express = require('express');
const paidService = require('./controller');

const router = express.Router();

router.get('/', paidService.getAllPaid);
router.get('/:id', paidService.getPaid);
router.post('/', paidService.createPaid);
router.delete('/', paidService.removePaid);
router.patch('/:id', paidService.updatePaid);
router.post('/start-date', paidService.getStartDatePaidClass);
router.post('/schedule-update', paidService.updateSchedulePaid);
router.get('/:student/paid', paidService.getPaidClassForStudent);

module.exports = router;
