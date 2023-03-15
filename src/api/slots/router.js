const express = require('express');
const slotControllers = require('./controller');

const router = express.Router();

router.post('/', slotControllers.createSlot);
router.get('/', slotControllers.getAllSlots);
router.get('/:id', slotControllers.getSlot);
router.delete('/:id', slotControllers.removeSlot);
router.put('/:id', slotControllers.updateSlot);
module.exports = router;
