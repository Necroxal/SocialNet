const Follow = require('./model');
const User = require('../users/model');
const response = require('../../utils/response');

const test = (req,res)=>{
    return response.succes(req,res,'success', 200);
}

const savefollow = (req,res)=>{
    //get dates of body
    const params = req.body;
    const identity = req.user;

    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed
    });
    
    userToFollow.save().then(data=>{
        res.status(200).send({
            status: 'success',
            identity: req.user,
            followed: data
        });

    }).catch(err =>{
        if(err || !data){
            return response.error(req, res, 'No follow user', 500, err);
        }
    });


   
}

const unFollow = (req,res)=>{
    const userId = req.user.id;

    const followedId = req.params.id;
    
    Follow.find({
        'user': userId,
        'followed': followedId
    }).deleteMany().then(data =>{

        res.status(200).send({
            status: 'success',
            message: 'Follow eliminated succesfuly',
        });
    }).catch(err=>{
        if(err || !data){
        return response.error(req, res, 'You are not following this user', 401, err);
        }
    });

}
module.exports = {
    test,
    savefollow,
    unFollow
}