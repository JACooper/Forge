const models = require('../models');

const Task = models.Task;

const createTask = (_request, _response) => {
  const request = _request;
  const response = _response;

  const title = request.body.task.title;
  const time = request.body.task.time;
  const effort = request.body.task.effort;
  const focus = request.body.task.focus;

  const taskData = {
    user: request.user._id,
    title,
    time,
    effort,
    focus,
  };

  const newTask = new Task.TaskModel(taskData);
  return newTask
    .save()
    .then(() => {
      response.status(200).json({});
    })
    .catch((error) => {
      console.dir(error);
      response.status(400).json({error: 'An error occurred creating the task'});
    });
};

const getTasks = (_request, _response) => {
  const request = _request;
  const response = _response;

  return Task.TaskModel.findTasks(request.user.id, (error, tasks) => {
    if (error) {
      console.dir(error);
      return response.status(400).json({error: 'An error occurred retrieving tasks'});
    }

    return response.json({tasks});
  });
};

module.exports.createTask = createTask;
module.exports.getTasks = getTasks;
