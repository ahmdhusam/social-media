import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        userName: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        tweets: [{ type: Schema.Types.ObjectId, required: true, ref: 'Tweet' }],
        following: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
        followers: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }]
    },
    { timestamps: true }
);

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
