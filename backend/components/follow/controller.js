const Follow = require('./model');
const User = require('../users/model');
const response = require('../../utils/response');
const followService = require('../../utils/followService');

const test = (req, res) => {
    return response.succes(req, res, 'success', 200);
}

const savefollow = (req, res) => {
    //get dates of body
    const params = req.body;
    const identity = req.user;

    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed
    });

    userToFollow.save().then(data => {
        res.status(200).send({
            status: 'success',
            identity: req.user,
            followed: data
        });

    }).catch(err => {
        if (err || !data) {
            return response.error(req, res, 'No follow user', 500, err);
        }
    });



}

const unFollow = (req, res) => {
    const userId = req.user.id;

    const followedId = req.params.id;

    Follow.find({
        'user': userId,
        'followed': followedId
    }).deleteMany().then(data => {

        res.status(200).send({
            status: 'success',
            message: 'Follow eliminated succesfuly',
        });
    }).catch(err => {
        if (err || !data) {
            return response.error(req, res, 'You are not following this user', 401, err);
        }
    });

}
//list users following
const following = (req, res) => {

    let userID = req.user.id;

    if (req.params.id) userID = req.params.id;

    let page = 1;
    if (req.params.page) page = req.params.page;
    page = parseInt(page);

    const options = {
        page: page,
        limit: 5,
        populate: ({ path: 'followed', select: ' -role -__v -password' })
    }

    Follow.paginate({ user: userID }, options)
        .then(async data => {

            let followUserIds = await followService.followUserIds(req.user.id);
            res.status(200).send({
                status: 'success',
                message: 'list users followed',
                data: data.docs,
                total: data.totalDocs,
                page: Math.ceil(data.totalDocs / data.limit),
                user_following: followUserIds.following,
                
            });
        }).catch(err => {
            return response.error(req, res, 'Not found', 404, err);
        });
}
//get followers
const followers = (req, res) => {
    let userID = req.user.id;

    if (req.params.id) userID = req.params.id;

    let page = 1;
    if (req.params.page) page = req.params.page;
    page = parseInt(page);

    const options = {
        page: page,
        limit: 5,
        populate: ({ path: 'user', select: ' -role -__v -password' })
    }


    Follow.paginate({ followed: userID }, options)
    .then(async data => {

        let followUserIds = await followService.followUserIds(req.user.id);
        res.status(200).send({
            status: 'success',
            message: 'list users follow me',
            data: data.docs,
            total: data.totalDocs,
            page: Math.ceil(data.totalDocs / data.limit),
            user_follow_me: followUserIds.followers
        });
    }).catch(err => {
        return response.error(req, res, 'Not found', 404, err);
    });

}


module.exports = {
    test,
    savefollow,
    unFollow,
    following,
    followers
}