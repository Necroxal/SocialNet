const { Schema, model } = require('mongoose');
//const mongoosePaginate = require('mongoose-paginate-v2');

const PublicationSchema = new Schema({
    text:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now
    }
});

//FollowSchema.plugin(mongoosePaginate);
module.exports = model('Publication', PublicationSchema);