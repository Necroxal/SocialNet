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
const following = (req,res)=>{

    let userID = req.user.id;

    if(req.params.id) userID = req.params.id;
    
    let page = 1;
    if(req.params.page) page = req.params.page;
    page = parseInt(page);
    const itemPerPage = 5; //limit elements
    //query with mongoose pagination

    const options = {
        page: page,
        limit:5,
        populate:({ path: 'user followed', select: ' -role -__v -password'}) 
    }
    
    Follow.paginate({user: userID}, options)
    .then(data=>{
        res.status(200).send({
            status: 'success',
            message: 'list users followed',
            data: data.docs,
            total: data.totalDocs,
            page: Math.ceil(data.totalDocs / data.limit)
        });
    }).catch(err =>{
        return response.error(req, res, 'Not found', 404, err);
    });
}
const followers = (req,res)=>{
    res.status(200).send({
        status: 'success',
        message: 'list users followed',
    });
}
module.exports = {
    test,
    savefollow,
    unFollow,
    following,
    followers
}