import mongoose, { Schema, Types } from 'mongoose';

export interface IUserModel {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    tweets: Types.ObjectId[];
    following: Types.ObjectId[];
    followers: Types.ObjectId[];
}

const userSchema = new Schema<IUserModel>(
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

const UserModel = mongoose.model<IUserModel>('User', userSchema);
export default UserModel;
