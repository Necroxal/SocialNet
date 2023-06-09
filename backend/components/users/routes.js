const express = require('express');
const controller = require('./controller');
const router = express.Router();
const {uploadImage} = require('../../middleware/multer');
const check = require('../../middleware/auth');

//routes
router.get('/test',check.auth, controller.testUser);
router.post('/create',uploadImage(), controller.createUser);
router.post('/login', controller.userLogin);
router.get('/profile/:id',check.auth, controller.profileUser);
router.get('/list/:page?',check.auth, controller.listUser);
router.put('/update',check.auth, controller.updateUser);
router.post('/uploadimg',[check.auth,uploadImage()], controller.uploadImage);
router.get('/avatar/:file', controller.avatar);
router.get('/counters/:id', check.auth, controller.counters);
module.exports = router;


