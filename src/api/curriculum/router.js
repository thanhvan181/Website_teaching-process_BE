const express = require('express');
const currService = require('./controller');

const router = express.Router();

router.get('/', currService.getAllCurr);
router.get('/:id', currService.getCurr);
router.post('/', currService.createCurr);
router.delete('/:id', currService.removeCurr);
router.patch('/:id', currService.updateCurr);

module.exports = router;
