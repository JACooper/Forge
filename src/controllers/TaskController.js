const models = require('../models');

const Task = models.Task.TaskModel;
const Category = models.Category.CategoryModel;

const createTask = (_request, _response) => {
  const request = _request;
  const response = _response;

  const title = request.body.task.title;
  const time = request.body.task.time;
  const effort = request.body.task.effort;
  const focus = request.body.task.focus;
  
  const category = request.body.task.category;

  Category.find({user: request.user._id, name: category})
    .exec()
    .then((categories) => {
      const taskData = {
        category: categories[0]._id,
        title,
        time,
        effort,
        focus,
      };
      const newTask = new Task(taskData);
      return newTask.save();
    })
    .then((savedTask) => {
      response.status(200).json({task: savedTask});
    })
    .catch((error) => {
      console.dir(error);
      response.status(400).json({error: 'An error occurred creating the task'});
    });
};

const getTasks = (_request, _response) => {
  const request = _request;
  const response = _response;

  Category.find({ user: request.user._id })
    .exec()
    .then((categories) => {
      return Promise.all(categories.map((category) => {
        return category.id;
      }));
    })
    .then((categoryIds) => {
      return Promise.all(categoryIds.map((id) => {
        return Task.find({ category: id })
          .populate('category')
          .exec();
      }));
    })
    .then((categorizedTasks) => {
      let tasks = [];
      categorizedTasks.forEach((cTasks) => {
        tasks = tasks.concat(cTasks);
      });

      return response.status(200).json({ tasks });
    })
    .catch((error) => {
      console.dir(error);
      return response.status(400).json({error: 'An error occurred retrieving tasks'});
    });
};

module.exports.createTask = createTask;
module.exports.getTasks = getTasks;
