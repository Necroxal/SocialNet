const user = require('../components/users/routes');
const follow = require('../components/follow/routes');
const publication = require('../components/publication/routes');
//&Fucntion to manage routes
//?The parameter is sent in app.js (main project)
const router = (app)=>{
    app.use('/user', user);
    app.use('/follow',follow);
    app.use('/publication',publication);
}
module.exports = router;