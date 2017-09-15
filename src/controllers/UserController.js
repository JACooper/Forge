const models = require('../models');

const User = models.User.UserModel;

const register = (_request, _response) => {
  const request = _request;
  const response = _response;

  if (!request.body.email || !request.body.password || !request.body.passwordConfirm) {
    return response.status(400).json({ error: 'Not all fields supplied' });
  }

  const email = request.body.email.toString();
  const password = request.body.password.toString();
  const passwordConfirm = request.body.passwordConfirm.toString();

  // Duplicate basic validation on server side
  // Keep in mind real validation requires actually sending an email (TODO. . .?)
  if (!email.search(new RegExp(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/))) {
    return response.status(400).json({ error: 'Invalid email address' });
  }

  if (password !== passwordConfirm) {
    return response.status(400).json({ error: 'Passwords do not match' });
  }

  // Create a new User with a email and whatever other fields are desired
  const newUser = new User({ email });

  User.register(newUser, password, (error, user) => {
    if (error) {
      console.dir(error); // TODO: Go through passport source to determine all possible error msgs
      return response.status(400).json({ error: 'An error occurred during registration' });
    }

    // NOTE: Sending back sessionID is probably excessive, given it isn't actually used
    //  for further requests

    // If we make it here, the user was registered successfully
    // They should now be stored in request.user
    return response.json({ id: request.sessionID, user: user.email });
  });
};

const login = (_request, _response) => {
  const request = _request;
  const response = _response;

  // Whatever render information we want goes here
  // Remember that the user is stored in request.user (from passport.authenticate)
  return response.json({ id: request.sessionID, user: request.user.email });
};

const logout = (_request, _response) => {
  const request = _request;
  const response = _response;

  request.logout();   // Logout is supplied by passport. May be redundant alongside session.destroy()
  request.session.destroy();
  
  // redirect/respond as appropriate
  return response.json({ msg: 'Logout successful' }); // Temporary return to make ESLint happy
};

const changePassword = (_request, _response) => {
  const request = _request;
  const response = _response;

  if (!request.body.newPassword || !request.body.newPasswordConfirm) {
    return response.status(400).json({ error: 'Not all fields supplied' });
  }

  const newPassword = request.body.newPassword.toString();
  const newPasswordConfirm = request.body.newPasswordConfirm.toString();

  if (newPassword !== newPasswordConfirm) {
    return response.status(400).json({ error: 'Passwords do not match' });
  }

  // Set password is an instance method supplied to all users by passport-local-mongoose
  request.user.setPassword(newPassword, (error, user) => {
    if (error) {
      return response.status(400).json({ error: 'An error occured changing passwords' });
    }

    // Return success confirmation, or any other success action
    user.save();    // Save changes to database
    return response.json({ user: user.username });  // Temporary return to make ESLint happy
  });
};

module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
module.exports.changePassword = changePassword;
