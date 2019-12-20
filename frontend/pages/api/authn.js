export const authnMiddleware = (api) => (req, res) => {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  return api(req, res);
};

export default authnMiddleware;
