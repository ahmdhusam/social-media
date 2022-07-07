import UserResolver from '../controllers/userResolver';
import TweetResolver from '../controllers/tweetResolver';

export default {
    ...UserResolver.getInstance,
    ...TweetResolver.getInstance
};
