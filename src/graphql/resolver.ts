import { UserResolver, TweetResolver } from '../controllers';

export default {
    ...UserResolver.getInstance,
    ...TweetResolver.getInstance
};
