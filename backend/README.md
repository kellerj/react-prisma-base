# react-prisma-base-backend

> Data Mapping and Business Logic for the Application

The backend is a GraphQL server which provides the business logic layer for the front-end and proxies any requests to the back end database while enforcing any business or authorization rules.

## NPM Scripts

> Run the following below via `npm run <command name>` in this directory.

| Command        | Purpose                                                                           |
| -------------- | --------------------------------------------------------------------------------- |
|                | **Development Commands**                                                          |
| `dev`          | Runs the server with hot-reloading for development work.                          |
| `debug`        | Same as above but enables attaching of a debugger.                                |
| `generate`     | Generate the Prisma JS bindings which allow your resolvers to run Prisma commands |
| `token`        | Generate a token which can be used to talk to the backend graphql API             |
|                | **Testing Commands**                                                              |
| `test`         | Run all unit tests and ESLint rules and report findings.                          |
| `test:watch`   | Run all unit tests and ESLint rules and watch for any file changes.               |
| `lint`         | Run ESLint rules and report findings.                                             |
| `lint:fix`     | Run ESLint rules, autofixing any which can be, and report findings.               |
|                | **Prisma Commands**                                                               |
| `prisma`       | Start up the local prisma server in a Docker container.                           |
| `prisma:stop`  | Shut down a running prisma docker container                                       |
| `db:deploy`    | Apply the current datamodel to the Prisma-controlled database.                    |
| `db:seed`      | Load initial data into the database.  Run automatically with first `db:deploy`    |
| `db:reset`     | **Destroy** and re-seed the database data.                                        |
| `db:admin`     | Open the Prisma Admin tool in your default browser.                               |
| `prisma:token` | Generate a token for use in testing in the prisma playground                      |
|                | **Server Commands**                                                               |
| `start`        | Runs the backend in server mode.                                                  |
|                | **Support Commands**                                                              |
| `doc`          | Generate documentation based on the JSDoc comments.                               |
| `postinstall`  | Run automatically as part of install to generate prisma JS bindings upon setup    |
| `gen-keypair`  | Generate an encryption keypair with the given name and passphrase.                |

## Running

To run the application you need to have your MongoDB running.  (Assumption is that it is on your local machine on port 27017.  This can be either as a local server or running in a port-mapped docker container.)

1. Run Prisma (`npm run prisma`)
2. Deploy Database Changes (`npm run db:deploy`)
3. Run Backend (`npm run dev`)

## Configuration Propeties
