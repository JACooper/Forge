const models = require('../models');

const Task = models.Task;

const createTask = (_request, _response) => {
  const request = _request;
  const response = _response;

  const title = request.body.task.title;

  const taskData = {
    title,
  };

  const newTask = new Task.TaskModel(taskData);
  return newTask.save()
          .then(() => response.status(200))
          .catch((error) => {
            return response.status(400).json({error: error});
          });
};

const getTasks = (_request, _response) => {
  const request = _request;
  const response = _response;

  return Task.TaskModel.findTasks((error, tasks) => {
    if (error) {
      return response.status(400).json({error: 'An error occurred retrieving tasks'});
    }

    return response.json({tasks});
  });
};

module.exports.createTask = createTask;
module.exports.getTasks = getTasks;
