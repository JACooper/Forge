const models = require('../models');

const Task = models.Task.TaskModel;

const createTask = (_request, _response) => {
  const request = _request;
  const response = _response;

  const title = request.body.task.title;
  const time = request.body.task.time;
  const effort = request.body.task.effort;
  const focus = request.body.task.focus;
  const category = request.body.task.categoryID;
  
  const taskData = {
    user: request.user._id,
    category,
    title,
    time,
    effort,
    focus,
  };
  const newTask = new Task(taskData);
  return newTask.save()
    .then((savedTask) => {
      Task.findById(savedTask._id)
        .populate('category')
        .exec()
        .then((task) => {
          response.status(200).json({task});
        });
    })
    .catch((error) => {
      console.dir(error);
      response.status(400).json({error: 'An error occurred creating the task'});
    });
};

const getTasks = (_request, _response) => {
  const request = _request;
  const response = _response;

  return Task.findTasksByUser(request.user._id, (error, tasks) => {
    if (error) {
      console.dir(error);
      return response.status(400).json({error: 'An error occurred retrieving tasks'});
    }

    return response.json({tasks});
  });
};

const toggleComplete = (_request, _response) => {
  const request = _request;
  const response = _response;

  return Task.findOne({ user: request.user._id, _id: request.body.id })
    .populate('category')
    .exec()
    .then((task) => {
      task.complete = !task.complete;
      return task.save();
    })
    .then((updatedTask) => {
      return response.status(200).json({task: updatedTask});
    })
    .catch((error) => {
      console.dir(error);
      return response.status(400).json({error: 'An error occurred completing the task'});
    });
};

const changeCategory = (_request, _response) => {
  const request = _request;
  const response = _response;

  const search = { user: request.user._id, _id: request.body.taskID };
  const update = { category: request.body.categoryID }; // Mongoose will automatically send as $set
  return Task.findOneAndUpdate(search, update, { new: true })
    .populate('category')
    .exec()
    .then((updatedTask) => {
      return response.status(200).json({task: updatedTask});
    })
    .catch((error) => {
      console.dir(error);
      return response.status(400).json({error: 'An error occurred changing the task category'});
    });
};

module.exports.createTask = createTask;
module.exports.getTasks = getTasks;
module.exports.toggleComplete = toggleComplete;
module.exports.changeCategory = changeCategory;
