/* eslint-disable import/no-extraneous-dependencies */
const casual = require('casual');
const db = require('../../src/prisma').bindings;

const createSomething = async (name) => {
  const result = await db.mutation.createSomething({
    data: {
      name,
    },
  }, '{ id name }');
  console.log(`Inserted Something: ${JSON.stringify(result)}`);
  return result;
};

const setup = async () => {
  console.log('Seeding Database');

  await createSomething(casual.word);
};

setup();
