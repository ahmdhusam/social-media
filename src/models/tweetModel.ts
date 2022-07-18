import mongoose, { Schema, Types } from 'mongoose';

interface ITweetModel {
    content: string;
    replys: Types.ObjectId[];
    creator: Types.ObjectId;
}

const tweetSchema = new Schema<ITweetModel>(
    {
        content: { type: String, required: true },
        replys: [{ type: Schema.Types.ObjectId, required: true, ref: 'Tweet' }],
        creator: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
    },
    { timestamps: true }
);

const TweetModel = mongoose.model<ITweetModel>('Tweet', tweetSchema);

export default TweetModel;
