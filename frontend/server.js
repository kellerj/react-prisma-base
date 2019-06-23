/**
 * @file Main entry point for front end server.  Starts Express server and mindsbinds Next.js into all paths.
 * @module server
 */
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handleNextJsRequest = app.getRequestHandler();

/**
 * Creates the Express server and sets up any needed routes before starting the server.
 */
function configureExpress() {
  const server = express();

  server.get('*', (req, res) => handleNextJsRequest(req, res));

  server.listen(process.env.FRONTEND_PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${process.env.FRONTEND_URL}`);
  });
}

app.prepare()
  .then(configureExpress)
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
