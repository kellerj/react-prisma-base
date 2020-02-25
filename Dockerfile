#
# Build on full version of node
#
FROM node:10 AS BUILDER


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

#
# Runner using smaller version of the Node image
#
FROM node:10-slim AS runner

RUN apt-get -q update && apt-get -qy install netcat

WORKDIR /usr/src/app
# Bring over all the node modules
COPY --from=builder /usr/src/app .
# Now copy the rest of the application
COPY . .

RUN npm run generate

EXPOSE 4444

CMD [ "npm", "run", "dev" ]
