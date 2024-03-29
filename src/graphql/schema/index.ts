import { buildSchema } from 'graphql';

export default buildSchema(`
    scalar Date

    type User {
        id: ID!
        name: String!
        userName: String!
        email: String!
        bio: String!
        birthDate: Date!
        gender: String!
        avatar: String!
        header: String!
        createdAt: Date!
        tweets: [Tweet!]!
        likes: [Tweet!]!
        retweets: [Tweet!]!
        followings: [User!]!
        followers: [User!]!
    }

    type Tweet {
        id: ID!
        content: String!
        createdAt: Date!
        creator: User!
        images:[image!]!
        likedBy: [User!]
        retweetedBy: [User!]!
        replys: [Tweet!]!
    }

    type image {
        path: String!
    }

    type CreatedUser {
        name: String!
        userName: String!
        email: String!
        birthDate: Date!
        gender: String!
        avatar: String!
    }

    type UserToken {
        id: ID!
        access_token: String!
        name: String!
        userName: String!
        email: String!
        bio: String!
        birthDate: Date!
        gender: String!
        avatar: String!
        header: String!
        createdAt: Date!
        tweets: [Tweet!]!
        likes: [Tweet!]!
        retweets: [Tweet!]!
        followings: [User!]!
        followers: [User!]!
    }

    input UserData {
        name: String!
        userName: String!
        email: String!
        birthDate: Date!
        gender: String!
        password: String!
    }

    input EditUserData {
        name: String
        userName: String
        email: String
        birthDate: Date
        gender: String
    }

    input LoginData {
        email: String!
        password: String!
    }

    input TweetData {
        content:String!
    }

    input ReplyData {
        tweetId: ID!
        content: String!
    }

    input ChangePasswordData {
        old: String!
        new: String!
    }

    type RootQuery {
        me: User!
        login(loginContent: LoginData!): UserToken!
        getUser(userName: String!): User!
        getTweet(tweetId: ID!): Tweet!
        getTimeline: [Tweet!]!
    }

    type RootMutation {
        createUser(user: UserData!): CreatedUser!
        createTweet(tweet: TweetData!): Tweet!
        follow(userId: ID!): User!
        unfollow(userId: ID!): User!
        addReply(reply: ReplyData): Tweet!
        retweet(tweetId: ID!): Tweet!
        unRetweet(tweetId: ID!): Tweet!
        deleteTweet(tweetId: ID!): Tweet!
        changePassword(passwords: ChangePasswordData!): User!
        like(tweetId: ID!): Tweet!
        unLike(tweetId: ID!): Tweet!
        editProfile(userData: EditUserData!): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
