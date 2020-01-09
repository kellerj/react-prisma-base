import authn from './authn';
import { getLogger } from '../../lib/logger';

const logger = getLogger('api');

export const somethingHandler = (req, res) => {
  logger.info(`Received ${req.method} to some API`);
  if ( req.method === 'GET' ) {
    return res.status(200).end('Got Something from API!');
  } else {
    return res.status(200).json({ result: `${req.method} sent ${JSON.stringify(req.body)}` });
  }
};

export default authn(somethingHandler);
