const express = require('express');

const router = express.Router();
const {getDashboardAdmin} = require('./controller');

router.get('/', getDashboardAdmin);

module.exports = router;
