const user = require('../components/users/routes');
const follow = require('../components/follow/routes');
//&Fucntion to manage routes
//?The parameter is sent in app.js (main project)
const router = (app)=>{
    app.use('/user', user);
    app.use('/follow',follow);
}
module.exports = router;