const express = require('express');
const demoService = require('./controller');

const router = express.Router();

router.get('/', demoService.getAllDemo);
router.get('/:id', demoService.getDemo);
router.post('/', demoService.createDemo);
router.delete('/:id', demoService.removeDemo);
router.patch('/:id', demoService.updateDemo);

module.exports = router;
