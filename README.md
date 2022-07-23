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

## License

[MIT license](./LICENSE)
