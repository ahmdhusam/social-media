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
        friends: [User!]!
    }

    type returnUser {
        id: ID!
        token:String!
        firstName: String!
        lastName: String!
        userName: String!
        email: String!
        tweets: [Tweet!]!
        friends: [User!]!
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

    type RootQuery {
        login(loginContent: LoginInput!): returnUser!
        getUser: User!
        getTweet(tweetId: ID!): Tweet!
        getTimeline: [Tweet!]!
    }

    type RootMutation {
        createUser(user: UserInput!): User!
        createTweet(tweet: TweetInput!): Tweet!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
