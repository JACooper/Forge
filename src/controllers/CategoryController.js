const models = require('../models');

const Category = models.Category.CategoryModel;

const createCategory = (_request, _response) => {
  const request = _request;
  const response = _response;

  const name = request.body.category.name;

  const categoryData = {
    user: request.user._id,
    name,
  };

  // Still need to prevent a user from being able to make 2 categories with
  // the same name, WITHOUT preventing another user from making a category
  // with that name
  const newCategory = new Category(categoryData);
  return newCategory
    .save()
    .then((newCategory) => {
      response.status(200).json({category: newCategory});
    })
    .catch((error) => {
      console.dir(error);
      response.status(400).json({error: 'An error occurred creating the category'});
    });
};

const getCategories = (_request, _response) => {
  const request = _request;
  const response = _response;

  return Category.findCategories(request.user._id, (error, categories) => {
    if (error) {
      console.dir(error);
      return response.status(400).json({error: 'An error occurred retrieving categories'});
    }

    return response.json({categories});
  });
};

module.exports.createCategory = createCategory;
module.exports.getCategories = getCategories;
