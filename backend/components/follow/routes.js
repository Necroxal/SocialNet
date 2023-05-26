const express = require('express');
const controller = require('./controller');
const router = express.Router();
const check = require('../../middleware/auth');

router.get('/test', controller.test);
router.post('/savefollow',check.auth, controller.savefollow);
router.delete('/unfollow/:id',check.auth, controller.unFollow);
module.exports = router;