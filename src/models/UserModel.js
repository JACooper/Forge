const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;  // Use default promise library

let UserModel = {};

const UserSchema = new mongoose.Schema({
  // Define whatever fields we want here
});

// passport-local-mongoose automatically adds username, hash, and salt fields
// Also adds serializeUser, deserializeUser, and authenticate methods
UserSchema.plugin(passportLocalMongoose);

UserModel = mongoose.model('User', UserSchema);

module.exports.UserModel = UserModel;
module.exports.UserSchema = UserSchema;