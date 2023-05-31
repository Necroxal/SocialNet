const express = require('express');
const controller = require('./controller');
const router = express.Router();
const check = require('../../middleware/auth');

router.get('/test', controller.test);
router.post('/savefollow',check.auth, controller.savefollow);
router.delete('/unfollow/:id',check.auth, controller.unFollow);
router.get('/following/:id?/:page?',check.auth, controller.following);
router.get('/followers/:id?/:page?',check.auth, controller.followers);
module.exports = router;