const mongoose = require('mongoose');
mongoose.Promise = global.Promise;  // Use default promise library

let CategoryModel = {};
const CategorySchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },

  name: {
    type: String,
    trim: true,
    required: true,
  },

});

CategorySchema.statics.findCategories = (userID, callback) => {
  return CategoryModel.find({ user: mongoose.Types.ObjectId(userID) })
    .select('name')
    .exec(callback);
};

CategoryModel = mongoose.model('Category', CategorySchema);

module.exports.CategoryModel = CategoryModel;
module.exports.CategorySchema = CategorySchema;
