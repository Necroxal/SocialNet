const Follow = require('./model');
const User = require('../users/model');
const response = require('../../utils/response');

const test = (req,res)=>{
    return response.succes(req,res,'success', 200);
}

const savefollow = (req,res)=>{
    //get dates of body
    res.status(200).send({
        status: 'success',
        message: 'user followed',
        identity: req.user
    });
}

module.exports = {
    test,
    savefollow
}