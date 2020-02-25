import fetch from 'node-fetch';

export const healthCheck = async (req, res) => {
  // console.log(`Checking URL: ${process.env.BACKEND_BASE_URL}/.well-known/apollo/server-health`);
  const backendPing = await fetch(`${process.env.BACKEND_BASE_URL}/.well-known/apollo/server-health`,
    { follow: 0, timeout: 1000, redirect: 'error' }
  );
  // console.log(JSON.stringify(backendPing));
  // TODO: Add checks which actually test Prisma and MongoDB
  const systemUp = backendPing.ok;
  const statusMessages = [];
  if ( !backendPing.ok ) {
    statusMessages.push(backendPing.text());
  }
  res.status(200).send({
    status: systemUp?'UP':'DOWN',
    backend: backendPing.ok?'UP':'DOWN',
    prisma: '?',
    mongodb: '?',
    statusMessages,
  });
};

export default healthCheck;
