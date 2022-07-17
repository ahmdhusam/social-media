import mongoose from 'mongoose';

import { UserModel, TweetModel } from '../models';

process.on('message', async ({ tweet }) => {
    //sleep 10s
    await new Promise(resolve => {
        setTimeout(() => resolve(true), 10 * 1000);
    });

    await mongoose
        .connect(typeof process.env.DBURL === 'string' ? process.env.DBURL : '')
        .catch(_ => process.exit());

    await deleteNestedReplys(tweet);

    await mongoose.disconnect();
    process.exit();
});

async function deleteNestedReplys(tweet: any) {
    await UserModel.updateMany({ tweets: tweet._id }, { $pull: { tweets: tweet._id } });

    if (!tweet.replys.length) return;

    const replys = await TweetModel.find({ _id: { $in: tweet.replys } });
    replys.map(reply => deleteNestedReplys(reply));
    await Promise.all(replys);

    await TweetModel.deleteMany({ _id: { $in: tweet.replys } });
}
