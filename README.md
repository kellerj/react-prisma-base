# React-Prisma Application Template

## Build / Startup Instructions

1. Start up mongo/prisma servers

    ```sh
    cd backend
    docker-compose start -d
    ```

2. Deploy current schema to prisma

    ```sh
    cd backend
    npm run db:deploy
    ```

3. Start up the back end server

    ```sh
    cd backend
    npm run dev
    ```

4. Start up front end

    ```sh
    cd frontend
    npm run dev
    ```

## URLs

* Mongo database: localhost:27017
* Backend GraphQL Server: <http://localhost:4444>
* Prisma GraphQL Server: <http://localhost:4466>
* Application: <http://localhost:7777>

## Helper Commands

### Initial Setup of Mongo/Prisma

```sh
cd backend
docker-compose up -d
```

### View Docker Server Logs

```sh
cd backend
docker-compose logs -f
```
