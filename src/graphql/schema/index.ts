import { buildSchema } from 'graphql';

export default buildSchema(`

    type Tweet {
        id:ID!
        content:String!
        replys:[Tweet!]!
        creator:User!
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        userName: String!
        email: String!
        tweets: [Tweet!]!
        following: [User!]!
        followers: [User!]!
    }

    type UserToken {
        id: ID!
        token:String!
        firstName: String!
        lastName: String!
        userName: String!
        email: String!
        tweets: [Tweet!]!
        following: [User!]!
        followers: [User!]!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input UserInput {
        firstName: String!
        lastName: String!
        userName: String!
        email: String!
        password: String!
    }

    input TweetInput {
        content:String!
    }

    input ReplyInput {
        tweetId: ID!
        content: String!
    }

    type RootQuery {
        login(loginContent: LoginInput!): UserToken!
        getUser(userName:String!): User!
        getTweet(tweetId: ID!): Tweet!
        getTimeline: [Tweet!]!
    }

    type RootMutation {
        createUser(user: UserInput!): User!
        createTweet(tweet: TweetInput!): Tweet!
        follow(userId: ID!): User!
        unfollow(userId: ID!): User!
        addReply(reply: ReplyInput): Tweet!
        retweet(tweetId: ID!): Tweet!
        deleteTweet(tweetId: ID!): Tweet!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
