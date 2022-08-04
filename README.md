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
PGPORT={Postgres port URL}
PGNAME={Database name}
PGPASSWORD={Database password}
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
      name: "Luke Skywalker"
      userName: "luke_skywalker"
      email: "lukeskywalker@mail.com"
      birthDate: "1996-1-11"
      gender: "male"
      password: "strongPassword"
    }
  ) {
    name
    userName
    email
    birthDate
    gender
    avatar
  }
}
```

Login To Get Access Token Back (_You have to put the access token in the authorization header like "Bearer [access_token]"_):

```graphql
query {
  login(loginContent: { email: "lukeskywalker@mail.com", password: "12345678" }) {
    id
    access_token
    name
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

Return the current user:

```graphql
mutation {
  me {
    id
    name
    userName
    email
    bio
    birthDate
    gender
    avatar
    header
    createdAt
    tweets {
      id
      content
      replys {
        content
        creator {
          userName
        }
      }
    }
    followings {
      id
      name
      userName
      avatar
      header
    }
    followers {
      id
      name
      userName
      avatar
      header
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
  retweet(tweetId: "0ac7bc4b-e0ac-4d33-abdf-725fa9351827") {
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
  addReply(reply: { tweetId: "0ac7bc4b-e0ac-4d33-abdf-725fa9351827", content: "Reply 1" }) {
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
  getTweet(tweetId: "0ac7bc4b-e0ac-4d33-abdf-725fa9351827") {
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
  follow(userId: "4920b7c7-01d6-41e2-bf1e-249c2ee65e1d") {
    id
    name
    userName
    email
    followers {
      id
      name
      userName
      email
    }
  }
}
```

Unfollow a User You Already Follow:

```graphql
mutation {
  unfollow(userId: "4920b7c7-01d6-41e2-bf1e-249c2ee65e1d") {
    name
    userName
  }
}
```

Delete Tweet (_It Will Delete all Nested Replies_):

```graphql
mutation {
  deleteTweet(tweetId: "0ac7bc4b-e0ac-4d33-abdf-725fa9351827") {
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
  changePassword(passwords: { old: "strongPassword", new: "lukesky123" }) {
    id
    name
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
    name
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
      name
      userName
    }
  }
}
```

## License

[MIT license](./LICENSE)
