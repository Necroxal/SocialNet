const jwt = require('jwt-simple');
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();

//Secret Key
const secret_key = process.env.SECRET_KEY;

//function token
const createToken = (data) =>{
    const payload = {
        id: data._id,
        name: data.name,
        surname: data.surname,
        nickname: data.nickname,
        email: data.email,
        role: data.role,
        image: data.image,
        iat: moment().unix(),
        exp: moment().add(30,"days").unix()
    };

    //get token encoded
    return jwt.encode(payload,secret_key);
}

module.exports = {
    createToken,
    secret_key
}