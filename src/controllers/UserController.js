const models = require('../models');

const User = models.User.UserModel;

const signup = (_request, _response) => {
  const request = _request;
  const response = _response;

  if (!request.body.username || !request.body.password || !request.body.passwordConfirm) {
    return response.status(400).json({ error: 'Not all fields supplied' });
  }

  const username = request.body.username.toString();
  const password = request.body.password.toString();
  const passwordConfirm = request.body.passwordConfirm.toString();

  if (password !== passwordConfirm) {
    return response.status(400).json({ error: 'Passwords do not match' });
  }

  // Create a new User with a username and whatever other fields are desired
  const newUser = new User({ username });

  User.register(newUser, password, (error, user) => {
    if (error) {
      return response.status(400).json({ error: 'Could not register user!' });
    }

    // If we make it here, the user was registered successfully
    // They should now be stored in request.user
    return response.json({ user: user.username });  // Temporary return to make ESLint happy
  });
};

const signin = (_request, _response) => {
  const request = _request;
  const response = _response;

  // Whatever render information we want goes here
  // Remember that the user is stored in request.user (from passport.authenticate)
  return response.json({ user: request.user.username });  // Temporary return to make ESLint happy
};

const signout = (_request, _response) => {
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

module.exports.signup = signup;
module.exports.signin = signin;
module.exports.signout = signout;
module.exports.changePassword = changePassword;
