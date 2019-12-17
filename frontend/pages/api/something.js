export const somethingHandler = (req, res) => {
  if ( req.method === 'GET' ) {
    return res.status(200).end('Got Something from API!');
  } else {
    return res.status(200).json({ result: `${req.method} sent ${JSON.stringify(req.body)}` });
  }
};

export default somethingHandler;
