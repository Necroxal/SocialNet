const { Schema, model } = require('mongoose');


const FollowSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    followed:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    created_at:{
        type: Date,
        default: Date.now
    }
});


module.exports = model('Follow', FollowSchema);