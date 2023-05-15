const jwt = require('jwt-simple');
const moment = require('moment');

const libjwt = require('../utils/jwt');
const secret = libjwt.secret_key;

const auth = (req,res,next) =>{
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "The request does not have the authentication header"
        });
    }
    //clean token
    let token = req.headers.authorization.replace(/['"]+/g,'');
    //decoe token
    try {
        let payload = jwt.decode(token,secret);
    
        //expired token
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                status: "error",
                message: "Expired Token",
            });
        }
           //add request
        req.user = payload;
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Invalid Token",
            error
        });
    }
 

    next();



}

module.exports = {
    auth
}