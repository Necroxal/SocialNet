const express = require('express');
const controller = require('./controller');
const router = express.Router();
const check = require('../../middleware/auth');

router.get('/test',check.auth, controller.test);
router.post('/create', check.auth, controller.savePubli);
router.get('/viewpublication/:id', check.auth, controller.onePubli);
module.exports = router;
