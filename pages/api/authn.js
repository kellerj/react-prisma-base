import { getLogger } from '../../lib/logger';

const logger = getLogger('authorization');

export const authnMiddleware = (api) => (req, res) => {
  if (!req.user) {
    logger.warn('Unauthorized access attempt to API');
    return res.status(401).send('Unauthorized');
  }
  return api(req, res);
};

export default authnMiddleware;
