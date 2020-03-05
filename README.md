# React-Prisma Application Template

> **TODO** Project Overview - a brief summary of the purpose of this application and the functions it performs.

> **TODO** If there is documentation on this project stored elsewhere, it can be linked to from here.

> **Note:** Please delete placeholder content when using this template.

## Using this template project

1. Clone this repository
2. If you don't want the history, remove the .git directory.
3. If you want the history, remove the original upstream: `git remote remove origin`
4. Add the new repository as the origin:

    ```sh
    git remote add origin -t master -m master <remote URL>
    ```
5. Update the project name in all README and package.json files.
6. Update the app name in `backend/.env.example`
7. Remove the `Something` datamodel object and all related components. (resolver actions, ShowSomething.jsx, graphql-shield checks)

## Project Structure

| Directory                 | Purpose                                                 |
| ------------------------- | ------------------------------------------------------- |
| `frontend`                | **UI Components for application**                       |
| `frontend/pages`          | Main pages used for application routes                  |
| `frontend/pages/api`      | API routes (non-UI URLs)                                |
| `frontend/components`     | JSX/React components                                    |
| `frontend/lib`            | Any helper code files                                   |
| `frontend/styles`         | SCSS Bootstrap config and theme setup                   |
| `frontend/public`         | Static content sourced by pages                         |
| ------------------------- | ------------------------------------------------------- |
| `backend`                 | **Business logic and data access GraphQL server**       |
| `backend/database`        | Database schema and backend graphQL schema.             |
| `backend/database/seed`   | Tnitial data seeding scripts.                           |
| `backend/keys`            | Development-only encryption public/private key files.   |
| `backend/scripts`         | Helper scripts to configure the application.            |
| `backend/src`             | Core server components                                  |
| `backend/src/generated`   | Prisma-client generated files                           |
| `backend/src/lib`         | support libraries                                       |
| `backend/src/middlewares` | GraphQL Server middleware for logging and authorization |
| `backend/src/resolvers`   | GraphQL resolvers                                       |
| `backend/scripts`         | Helper/config test scripts.                             |

### Requirements

> Note any software which needs to be installed on the developer's system prior to being able to install or run the application.

* Docker (for Prisma)
* MongoDB 4+
* Node 12+

#### VS Code Plugins

If you are using VS Code, please have these plugins installed to ensure code developed confirms to development standards within the existing code base.

* Better Comments
* Code Spell Checker
* Dependency Analytics
* EditorConfig for VS Code
* ESLint
* Markdown Table Formatter
* markdownlint
* YAML

#### Recommended VS Code Plugins

While not necessary, these may help with development:

* Bracket Pair Colorizer 2
* Docker
* Document This
* DotENV
* GraphQL (Prisma)
* Markdown All in One
* Toggle Quotes
* vscode-styled-components

## Install / Setup

> Provide any instructions needed to setup an developer environment to be able to run this application.  These instructions may also apply to server setup done by operations, but a formal document for the operations handoff should be a separate document as there are usually more considerations which need to be made in non-developer environments.  (account creation, firewalls, load balancing, etc...)

### Configuration Setup

The [`.env.example`](./backend/.env.example) file should be functional for a local deployment of the application.

* Copy `backend/.env.example` to `backend/.env`

### MongoDB Setup

If you are not using the docker-compose version of MongoDB, you will need to create a prisma user on your local MongoDB instance.  Log into your server and issue the following command:

```js
db.createUser({
    user: "prisma",
    pwd: "prisma",
    roles: [ "dbAdmin" ]
});
```

## System Components

This application requires 4 local servers during development.

| Server           | Port  | Purpose                     |
| ---------------- | ----- | --------------------------- |
| Frontend Server  | 7777  | Next.js/Apollo Client       |
| Backend Server   | 4444  | Apollo Server/Backend Logic |
| Prisma Server    | 4466  | GraphQL Database Mapping    |
| MongoDB Database | 27017 | Database                    |

## Running

To run the application you need to have your MongoDB running.  (Assumption is that it is on your local machine on port 27017.  This can be either as a local server or running in a port-mapped docker container.)

1. Run Prisma (./backend `npm run prisma`)
2. Deploy Database Changes (./backend `npm run db:deploy`)
3. Run Backend (./backend `npm run dev`)
4. Run Frontend (./frontend `npm run dev`)

> Describe how to run and access the application.  In the case of an application which runs as part of a larger server, then note the URL at which the application can be accessed.  (And any important URLs the application exposes.)
>
> If there is a way to start up the application in debug mode, describe that as well.

### Running Prisma

Prisma is a general-purpose server.  You only need one instance running for all Prisma-based applications you are working on (per database type - Mongo/MySQL/etc...)

Prisma runs in a docker container.  No local install is needed except for the Docker host application.

You have two options when running Prisma.  If you already have a local MongoDB database running on your system on port 27017, then you can use the npm command:

```sh
npm run prisma
```

That will start up the Prisma server and leave it running in the background.  Prisma's configuration is in [backend/PRISMA_CONFIG.yml](./backend/PRISMA_CONFIG.yml).  You can check the running status of the server by running:

```sh
docker ps
```

To stop (and delete) the Prisma server:

```sh
npm run prisma:stop
```

#### Prisma URLs

Prisma will be running a GraphQL Playground at <http://localhost:4466/${APP_NAME}/local>.  You will need a token to be able to use it.  Run the `db:token` command for that.

Prisma also has a useful administrative UI.  To access that for your database, run: `npm run db:admin` to open that in your browser.

#### Using Docker Compose

If you do not have a MongoDB server already running, you can also use docker compose to start up both a prisma and MongoDB server.  In the backend directory run:

| Action                   | Command                |
| ------------------------ | ---------------------- |
| Create and start servers | `docker-compose up -d` |
| Check server status      | `docker-compose ps`    |
| View the server logs     | `docker-compose logs`  |
| Stop the servers         | `docker-compose stop`  |
| Resume stopped servers   | `docker-compose start` |
| Stop and destroy servers | `docker-compose down`  |

### Deploying Database Changes

Before running the server for the first time, and after any change to `database/datamodel.graphql`, you must deploy the changes to Prisma.  (This also updates the JavaScript bindings that the backend server uses to talk to the database.  Those must be in sync or the client will not know about the changes.)

This has been encapsulated in the command below.  On first run, this will also seed the database with any data which is needed upon first load.  The master seed script is `database/seed/index.js`.  See Prisma's examples for more information.  (e.g., <https://github.com/prisma/prisma-examples/blob/master/node/graphql/prisma/seed.js>)

```sh
npm run db:deploy
```

### Running Backend

Once Prisma is running and the database deployed, you can start up the backend server.  This will start it with monitoring which will restart the application when you make code changes and will enable the debugger ports so you can connect a NodeJS Inspector client to it.

```sh
npm run dev
```

While the backend does not have an explicit UI.  (It's a GraphQL API Server.)  There is a supporting playground (almost identical to the Prisma one) running at <http://localhost:4444/playground>

### Running Frontend

Finally, starting up the frontend is the same.  You do not need to run the build script, that is for server deployments only.

```sh
npm run dev
```

After starting up, the application should be running at <http://localhost:7777>

## Testing

> **TODO** If you have any automated testing, describe how to run it and where the results are saved.

## Using the Prisma GraphQL Playground

Since the Prisma server is protected by an application secret, you must provide authentication when using the playground.  To get the token you need for that, you must run the `npm run db:token` command.  It will return a JSON object which you will need to paste into the `HTTP HEADERS` tab in the bottom left of the playground.

The JSON object will look something like the following:

```json
{
  "APIAuthToken":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJ0ZWFAbG9jYWwiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNTU3NDI1MzMxLCJleHAiOjE1NTgwMzAxMzF9.r1q6R5Kpx40BqBgg1wgFj-OHqgfVHJoQD_shCEk2o8I"
}
```

> If you are interested in what the garbage above contains, it's a JWT token.  You can paste it into the page at <https://jwt.io/> to see its contents.

## Development URLs

* Application UI: <http://localhost:7777>
* Backend GraphQL Server: <http://localhost:4444>
* Prisma GraphQL Server: <http://localhost:4466>
* Mongo database: localhost:27017

## \[Other Information\]

> If you have other information which can be useful to anyone unfamiliar to this project, it can be included here.  If there is a lot of additional information, then you can link to files in the `docs/` sub-path.

## Links to Documentation for Server Software Used

* Prisma Server
  * <https://www.prisma.io/docs/prisma-server/>
* Apollo Server
  * <https://www.apollographql.com/docs/apollo-server/>
* Apollo Client
  * <https://www.apollographql.com/docs/react/>
* Next.js
  * <https://nextjs.org/docs>
