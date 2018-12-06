# Project

## Requirements

Recommended editor:
Visual Studio Code: https://code.visualstudio.com/Download

Prerequisite knowledge:
VS Code, Docker, JOI, ESLint, ES6, Mongo, Mongoose

System requirements:

- NODE Version : 8.9.0
- NPM Version : 5.5.0
- Docker: 18.09

## Getting Started

Make a copy of production.json as development.json in src/config folder and edit it as required
```sh
cp src/config/production.json src/config/development.json 
```
Install dependencies:

```sh
npm install
```

Set environment (vars):

```sh
cp .env.example .env
```


Run dependent services (mongo, redis) in docker container
```sh
docker-compose up;
```

### Available Scripts

- `npm start` - for starting development server
- `npm run startD` - for starting development server with nodemon
- `npm run build:start` - for packaging production build - it will build and start production enviroment
- `npm run start:prod` - for starting production server with existing build

##### Deployment

```sh
# compile to ES5
npm run build:start

# upload dist/ to your server
scp -rp dist/ user@dest:/path

# install production dependencies only
npm install --production

# Use any process manager to start your services
pm2 start dist/index.js
```

##### Deployment with docker

```sh
# preparing docker build
docker build -f Dockerfile  -t  <registry-path>/<image-name>:<version> .

# pushing docker build to registry
docker push <registry-path>/<image-name>:<version>

# Copy environment specific docker-compose.production.yml file
scp <ProjectPath>/docker-compose.production.yml user@dest:docker-compose.yml

# In production server run following
docker pull <registry-path>/<image-name>:<version> && docker-compose down && docker-compose up;
```

## Docker

#### Using Docker Compose for Development

```sh
# service restarts on file change
bash bin/development.sh
```

#### Building and running without Docker Compose

```bash
# To use this option you need to make sure mongodb is listening on port 27017

# Build docker
docker build -t projectPath .

# Run docker
docker run -p 4040:4040 projectPath
```

### Dependencies

- [aws-sdk - The official AWS SDK for JavaScript, available for browsers and mobile devices, or Node.js backends](https://www.npmjs.com/package/aws-sdk)

- [bluebird - Bluebird is a fully featured promise library with focus on innovative features and performance](https://www.npmjs.com/package/bluebird)

- [body-parser - Node.js body parsing middleware](https://www.npmjs.com/package/body-parser)

- [compression - Node.js compression middleware](https://www.npmjs.com/package/compression)

- [cookie-parser - Parse Cookie header and populate req.cookies with an object keyed by the cookie names. ](https://www.npmjs.com/package/cookie-parser)

- [cors - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options](https://www.npmjs.com/package/cors)

- [dotenv - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env](https://www.npmjs.com/package/dotenv)

- [express - Fast, unopinionated, minimalist web framework for node](https://www.npmjs.com/package/express)

- [helmet - Helmet helps you secure your Express apps by setting various HTTP headers](https://www.npmjs.com/package/helmet)

- [http-status - Utility to interact with HTTP status code](https://www.npmjs.com/package/http-status)

- [joi - Object schema description language and validator for JavaScript objects](https://www.npmjs.com/package/joi)

- [lodash - The Lodash library exported as Node.js modules](https://www.npmjs.com/package/lodash)

- [method-override - Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it](https://www.npmjs.com/package/method-override)

- [mongoose - Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment](https://www.npmjs.com/package/mongoose)

- [morgan - HTTP request logger middleware for node.js](https://www.npmjs.com/package/morgan)

- [redis - This is a complete and feature rich Redis client for node.js. It supports all Redis commands and focuses on high performance](https://www.npmjs.com/package/redis)

- [sha1 - a native js function for hashing messages with the SHA-1 algorithm](https://www.npmjs.com/package/sha1)

- [uuid - Simple, fast generation of RFC4122 UUIDS](https://www.npmjs.com/package/uuid)

- [winston - A logger for just about everything](https://www.npmjs.com/package/winston)

### Dev Dependencies

- [babel-cli - Babel command line](https://www.npmjs.com/package/babel-cli)

- [babel-core - Babel compiler core](https://www.npmjs.com/package/babel-core)

- [babel-eslint - babel-eslint allows you to lint ALL valid Babel code with the fantastic ESLint](https://www.npmjs.com/package/babel-eslint)

- [babel-plugin-add-module-exports - Handle module exports to export default ](https://www.npmjs.com/package/babel-plugin-add-module-exports)

- [babel-plugin-transform-object-rest-spread - This plugin allows Babel to transform rest properties for object destructuring assignment and spread properties for object literals](https://www.npmjs.com/package/babel-plugin-transform-object-rest-spread)

- [babel-plugin-transform-runtime - Externalise references to helpers and builtins, automatically polyfilling your code without polluting globals](https://www.npmjs.com/package/babel-plugin-transform-runtime)

- [babel-preset-airbnb - A babel preset for transforming your JavaScript for Airbnb](https://www.npmjs.com/package/babel-preset-airbnb)

- [babel-preset-env - A Babel preset that compiles ES2015+ down to ES5 by automatically determining the Babel plugins and polyfills you need based on your targeted browser or runtime environments](https://www.npmjs.com/package/babel-preset-env)

- [babel-preset-es2015 - Babel preset for all es2015 plugins](https://www.npmjs.com/package/babel-preset-es2015)

- [babel-register - The require hook will bind itself to node's require and automatically compile files on the fly](https://www.npmjs.com/package/babel-register)

- [cross-env - Run scripts that set and use environment variables across platforms](https://www.npmjs.com/package/cross-env)

- [eslint - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. In many ways, it is similar to JSLint and JSHint](https://www.npmjs.com/package/eslint)

- [eslint-config-airbnb-base - This package provides Airbnb's base JS .eslintrc (without React plugins) as an extensible shared config](https://www.npmjs.com/package/eslint-config-airbnb-base)

- [eslint-config-prettier - Turns off all rules that are unnecessary or might conflict with Prettier](https://www.npmjs.com/package/eslint-config-prettier)

- [eslint-plugin-import - This plugin intends to support linting of ES2015+ (ES6+) import/export syntax, and prevent issues with misspelling of file paths and import names](https://www.npmjs.com/package/eslint-plugin-import)

- [eslint-plugin-prettier - Runs Prettier as an ESLint rule and reports differences as individual ESLint issues](https://www.npmjs.com/package/eslint-plugin-prettier)

- [nodemon - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected](https://www.npmjs.com/package/nodemon)

- [prettier - Prettier is an opinionated code formatter](https://www.npmjs.com/package/prettier)


### Future Inhancements

- Add comments to all the files
- Add unit test cases
- Add CI/CD support
- Add "Must read" section in readme
- CLI option to generate project skeleton
