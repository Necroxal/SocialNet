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


module.exports = router;
