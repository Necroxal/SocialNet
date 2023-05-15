const user = require('../components/users/routes');
//&Fucntion to manage routes
//?The parameter is sent in app.js (main project)
const router = (app)=>{
    app.use('/user', user);
}
module.exports = router;