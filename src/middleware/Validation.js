const passport = require('passport');

const authorize = (req, res, next) => {
  passport.authorize('local', (error, user, info) => {
    if (error) {
      return next(error);  // If there was an error before now, pass it along
    }

    if (!user) {
      return res.status(401).json({ error: info.message });
    }

    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }

      return next();
    });
  })(req, res, next);
};

const isAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
  return next();
};

module.exports.authorize = authorize;
module.exports.isAuth = isAuth;