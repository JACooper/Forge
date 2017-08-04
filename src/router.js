// Controllers tells us what JS (that we right) to run on a given request
const controllers = require('./controllers');
// Middleware tells us what JS to run before sending a request to a controller
const middleware = require('./middleware');

/**
 * Sets up router
 * @param  {Express HTTP server} app The server to route
 */
const router = (app) => {

  app.post('/signup', controllers.User.signup);
  app.post('/signin', middleware.passport.authenticate('local'), controllers.User.signin);
  app.get('/signout', controllers.User.signout);
  app.post('/changePassword',
          middleware.passport.authenticate('local'),
          controllers.User.changePassword);
  // changePassword authenticates for PoC testing purposes
  // middleware.validation.isAuth should be used once we have a persistent client
  
  //app.get('*', error);
  //app.get('/', SomeDefault)
};

module.exports = router;