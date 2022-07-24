# Social Media Server App

## Express, GraphQL, MongoDB example

[![License](https://img.shields.io/badge/License-MIT-blue.svg?maxAge=2592000)](https://github.com/ahmdhusam/social-media/blob/main/LICENSE)

## How to run the project

### Required:

node.js: v18.4

Install dependencies:

```shell

yarn
# or using npm
npm install
```

Now create a file called `.env` in the project root and add the following variables, replacing the values with your own.

**.env**

```bash
DBURL={MongoDB URL}
PORT={Port} // Default 3300
SECRET_KEY={Secret Key For JWT}
ADMIN_ACCESS={Token to access Logs folder}
```

Run the project:

```shell
yarn start
# or using npm
npm start
```

Open GraphiQL in your browser [http://localhost:PORT/graphql](http://localhost:3300/graphql)

## Example Queries

Create new User:

```graphql
mutation {
  createUser(
    user: {
      firstName: "Luke"
      lastName: "Skywalker"
      userName: "luke_skywalker"
      email: "lukeskywalker@mail.com"
      password: "12345678"
    }
  ) {
    id
    firstName
    lastName
    userName
    email
    tweets {
      content
    }
    following {
      userName
    }
    followers {
      userName
    }
  }
}
```

Login To Get Access Token Back (_You have to put the access token in the authorization header like "Bearer [access_token]"_):

```graphql
query {
  login(loginContent: { email: "lukeskywalker@mail.com", password: "12345678" }) {
    id
    token
    firstName
    lastName
    userName
    email
    tweets {
      content
      creator {
        userName
      }
      replys {
        content
        creator {
          userName
        }
      }
    }
  }
}
```

Create new Tweet:

```graphql
mutation {
  createTweet(tweet: { content: "Tweet 1" }) {
    id
    content
    replys {
      content
    }
    creator {
      userName
    }
  }
}
```

Retweet:

```graphql
mutation {
  retweet(tweetId: "62dd9f6d456be30d7ab94ddd") {
    id
    content
    creator {
      userName
    }
  }
}
```

Add Reply To Tweet:

```graphql
mutation {
  addReply(reply: { tweetId: "62dd9f6d456be30d7ab94ddd", content: "Reply 1" }) {
    id
    content
    creator {
      userName
      email
    }
    replys {
      id
      content
      creator {
        userName
      }
      replys {
        content
        creator {
          userName
        }
      }
    }
  }
}
```

Get a Specific Tweet:

```graphql
query {
  getTweet(tweetId: "62dd9f6d456be30d7ab94ddd") {
    id
    content
    replys {
      content
      creator {
        userName
      }
    }
    creator {
      userName
    }
  }
}
```

Follow Another User:

```graphql
mutation {
  follow(userId: "62dd9d85456be30d7ab94dc7") {
    id
    firstName
    lastName
    userName
    email
    followers {
      id
      firstName
      lastName
      userName
      email
    }
  }
}
```

Unfollow a User You Already Follow:

```graphql
mutation {
  unfollow(userId: "62dd9dac456be30d7ab94dcc") {
    firstName
    lastName
    userName
  }
}
```

Delete Tweet (_It Will Delete all Nested Replies_):

```graphql
mutation {
  deleteTweet(tweetId: "62dd9f6d456be30d7ab94ddd") {
    content
    replys {
      id
      content
      replys {
        id
        content
        creator {
          userName
        }
      }
      creator {
        userName
      }
    }
    creator {
      userName
    }
  }
}
```

Update User Password:

```graphql
mutation {
  changePassword(passwords: { oldPassword: "12345678", newPassword: "lukesky123" }) {
    id
    firstName
    lastName
    userName
    email
  }
}
```

Get a Specific User:

```graphql
query {
  getUser(userName: "luke_skywalker") {
    id
    firstName
    lastName
    userName
    tweets {
      id
      content
      creator {
        userName
      }
    }
  }
}
```

Get List Of Tweets (_Ordered By Most Recent_):

```graphql
query {
  getTimeline {
    id
    content
    replys {
      id
      content
      creator {
        userName
      }
    }
    creator {
      firstName
      lastName
      userName
    }
  }
}
```

## License

[MIT license](./LICENSE)
