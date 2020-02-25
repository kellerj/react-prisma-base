#
# Build on full version of node
#
FROM node:10-slim AS builder

RUN npm set registry http://host.docker.internal:4873/

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm build
RUN npm prune --production

#
# Runner using smaller version of the Node image
#
FROM node:10-slim AS runner

WORKDIR /usr/src/app
# Bring over all the node modules
COPY --from=builder /usr/src/app .
# Now copy the rest of the application
COPY . .

EXPOSE 7777
ENV NODE_ENV=production
CMD [ "npm", "start" ]
