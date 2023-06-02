const Follow = require('../components/follow/model');

const followUserIds = async (identityUserId) => {

    try {
        //  get information
        let following = await Follow.find({ 'user': identityUserId })
            .select({ 'followed': 1, '_id': 0 })

        let followers = await Follow.find({ 'followed': identityUserId })
            .select({ 'user': 1, '_id': 0 })

        //proccesing
        let following_clean = [];
        following.forEach(follow => {
            following_clean.push(follow.followed);
        });

        let followers_clean = [];
        followers.forEach(follow => {
            followers_clean.push(follow.user);
        });

        return {
            following: following_clean,
            followers: followers_clean 
        }
    } catch (error) {
        return {};
    }
}
const followThisUser = async (identityUserId, profileUserId) => {

    try {
        //  get information
        let following = await Follow.findOne({ 'user': identityUserId, 'followed': profileUserId })
            

        let followers = await Follow.findOne({ 'user': profileUserId, 'followed': identityUserId })
           

        return {
            following,
            followers
        }
    } catch (error) {
        return {};
    }
}
module.exports = {
    followUserIds,
    followThisUser
}