import mongoose, { Schema } from 'mongoose';

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        replys: [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Tweet'
            }
        ],
        creator: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    { timestamps: true }
);

const TweetModel = mongoose.model('Tweet', tweetSchema);

export default TweetModel;
