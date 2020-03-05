/* eslint-disable no-console */
const jwt = require('jsonwebtoken');

// Signing secret for the token, must be shared by the backend server
const prismaSecret = process.env.PRISMA_SECRET;

console.log(`Signing Prisma Token for ${process.env.APP_NAME}@${process.env.INSTANCE_ID} using process.env.PRISMA_SECRET`);

const token = jwt.sign(
  { data: { service: `${process.env.APP_NAME}@${process.env.INSTANCE_ID}`, roles: ['admin'] }, exp: 2000000000 },
  prismaSecret,
);

console.log(token);
