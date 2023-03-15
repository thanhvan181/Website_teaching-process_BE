const express = require('express');
const {uploadFile, deleteFile} = require('./controller');

const router = express.Router();

router.post('', uploadFile);
router.delete('/:fileName', deleteFile);
module.exports = router;
