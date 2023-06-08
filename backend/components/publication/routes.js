const express = require('express');
const controller = require('./controller');
const router = express.Router();
const check = require('../../middleware/auth');
const {uploadImage} = require('../../middleware/multerPublications');

router.get('/test',check.auth, controller.test);
router.post('/create', check.auth, controller.savePubli);
router.get('/viewpublication/:id', check.auth, controller.onePubli);
router.delete('/delete/:id', check.auth,controller.deletePubli);
router.get('/listoneuser/:id/:page?', check.auth, controller.listPubliOneUser);
router.post('/uploadimg/:id', [check.auth,uploadImage()], controller.uploadImagePubli);
router.get('/media/:file', check.auth, controller.publicationMedia);
router.get('/feed/:page?', check.auth, controller.feed);
module.exports = router;

