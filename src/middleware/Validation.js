const isAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
  return next();
};

module.exports.isAuth = isAuth;