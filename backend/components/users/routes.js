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
module.exports = router;