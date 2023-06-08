const express = require('express');
const controller = require('./controller');
const router = express.Router();
const check = require('../../middleware/auth');
const {uploadImage} = require('../../middleware/multer');

router.get('/test',check.auth, controller.test);
router.post('/create', check.auth, controller.savePubli);
router.get('/viewpublication/:id', check.auth, controller.onePubli);
router.delete('/delete/:id', check.auth,controller.deletePubli);
router.get('/listoneuser/:id/:page?', check.auth, controller.listPubliOneUser);

module.exports = router;
