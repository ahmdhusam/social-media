import { ITweetResolver } from '../types';

export default class TweetResolver implements ITweetResolver {
    private static instance: TweetResolver;

    static get getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    private constructor() {}
}
