const express = require('express');
const controller = require('./controller');
const router = express.Router();
const check = require('../../middleware/auth');

router.get('/test',check.auth, controller.test);

module.exports = router;
