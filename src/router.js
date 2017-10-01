// Controllers tells us what JS (that we right) to run on a given request
const controllers = require('./controllers');
// Middleware tells us what JS to run before sending a request to a controller
const middleware = require('./middleware');

/**
 * Sets up router
 * @param  {Express HTTP server} app The server to route
 */
const router = (app) => {

  // -- Auth routes --
  app.post('/register',
    controllers.User.register,
    middleware.passport.authenticate('local'),
    (req, res) => {
      return res.status(200).json({ id: req.sessionID });
    });
  app.post('/login', middleware.validation.authorize, controllers.User.login);
  app.get('/logout', controllers.User.logout);
  app.post('/changePassword',
    middleware.passport.authenticate('local'),
    controllers.User.changePassword);
  // changePassword authenticates for PoC testing purposes
  
  // -- Task routes --
  app.post('/task', controllers.Task.createTask);
  app.get('/tasks', controllers.Task.getTasks);
  app.post('/update', controllers.Task.updateTask);
  app.post('/complete', controllers.Task.toggleComplete);
  app.post('/changeCategory', controllers.Task.changeCategory);

  // -- Category routes --
  app.post('/category', controllers.Category.createCategory);
  app.get('/categories', controllers.Category.getCategories);

  // -- Misc routes --
  //app.get('/', SomeDefault)
  //app.get('*', error);

};

module.exports = router;