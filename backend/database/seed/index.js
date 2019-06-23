/**
 * Database Seeding script - use defined prisma mutations
 * (src/generated/prisma.graphql)
 */
/* eslint-disable import/no-extraneous-dependencies */
const casual = require('casual');
const db = require('../../src/prisma').bindings;

const createSomething = async (code, name) => {
  const result = await db.mutation.createSomething({
    data: {
      code,
      name,
    },
  }, '{ id code name }');
  console.log(`Inserted Something: ${JSON.stringify(result)}`);
  return result;
};

const setup = async () => {
  console.log('Seeding Database');

  await createSomething('1', casual.word);
};

setup();
