const models = require('../models');

const Task = models.Task.TaskModel;

const createTask = (_request, _response) => {
  const request = _request;
  const response = _response;

  const title = request.body.task.title.toString();
  const time = request.body.task.time;
  const effort = request.body.task.effort;
  const focus = request.body.task.focus;
  const category = request.body.task.categoryID.toString();
  
  const taskData = {
    user: request.user._id,
    category,
    title,
    time,
    effort,
    focus,
  };

  if (request.body.task.startDate) {
    const startDate = Date.parse(request.body.task.startDate.toString());
    
    if (!isNaN(startDate)) {
      taskData.startDate = new Date(startDate);
    } else {
      return response.status(400).json({ error: 'Invalid start date supplied' });
    }
  }

  if (request.body.task.dueDate) {
    const dueDate = Date.parse(request.body.task.dueDate.toString());
    
    if (!isNaN(dueDate)) {
      taskData.dueDate = new Date(dueDate);
    } else {
      return response.status(400).json({ error: 'Invalid due date supplied' });
    }
  }

  if (taskData.startDate !== undefined && taskData.dueDate !== undefined
      && taskData.startDate.getTime() > taskData.dueDate.getTime()) {
    return response.status(400).json({ error: 'Start date cannot be after than due date' });
  }

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
      response.status(500).json({error: 'An error occurred creating the task'});
    });
};

const getTasks = (_request, _response) => {
  const request = _request;
  const response = _response;

  return Task.findTasksByUser(request.user._id, (error, tasks) => {
    if (error) {
      console.dir(error);
      return response.status(500).json({error: 'An error occurred retrieving tasks'});
    }

    return response.json({tasks});
  });
};

const updateTask = (_request, _response) => {
  const request = _request;
  const response = _response;

  // Collect and sanitize request data
  const id = request.body.task._id.toString();
  const title = request.body.task.title.toString();
  const time = request.body.task.time;
  const effort = request.body.task.effort;
  const focus = request.body.task.focus;
  const category = request.body.task.category._id.toString();
  
  const taskData = {
    category,
    title,
    time,
    effort,
    focus,
  };

  // Validate and reconstruct dates, if given
  if (request.body.task.startDate) {
    const startDate = Date.parse(request.body.task.startDate.toString());
    
    if (!isNaN(startDate)) {
      taskData.startDate = new Date(startDate);
    } else {
      return response.status(400).json({ error: 'Invalid start date supplied' });
    }
  }

  if (request.body.task.dueDate) {
    const dueDate = Date.parse(request.body.task.dueDate.toString());
    
    if (!isNaN(dueDate)) {
      taskData.dueDate = new Date(dueDate);
    } else {
      return response.status(400).json({ error: 'Invalid due date supplied' });
    }
  }

  if (taskData.startDate !== undefined && taskData.dueDate !== undefined
      && taskData.startDate.getTime() > taskData.dueDate.getTime()) {
    return response.status(400).json({ error: 'Start date cannot be after than due date' });
  }

  // Perform update
  const search = { user: request.user._id, _id: id };
  const update = taskData;
  return Task.findOneAndUpdate(search, update, { new: true })
    // .select('category title time effort focus complete startDate dueDate')
    .populate('category')
    .exec()
    .then((task) => {
      return response.status(200).json({ task });
    })
    .catch((error) => {
      console.dir(error);
      return response.status(500).json({ error: 'An error occurred updating the task' });
    });
};

const addLog = (_request, _response) => {
  const request = _request;
  const response = _response;

  const taskID = request.body.taskID.toString();

  const log = {};

  // Validate and reconstruct dates, if given
  if (request.body.date) {
    const date = Date.parse(request.body.date.toString());
    
    if (!isNaN(date)) {
      log.date = new Date(date);
    } else {
      return response.status(400).json({ error: 'Invalid log date supplied' });
    }
  }

  if (request.body.desc) {
    log.desc = request.body.desc.toString();
  }

  if (request.body.time) {
    log.time = request.body.time;
  }

  if (log.desc === undefined && log.time === undefined) {
    return response.status(400).json({ error: 'Work logs must have at least a description or a time' });
  }

  const search = { user: request.user._id, _id: taskID };
  const update = { '$push': { 'log': log } };
  return Task.findOneAndUpdate(search, update, { new: true })
    .populate('category')
    .exec()
    .then((task) => {
      return response.status(200).json({ task });
    })
    .catch((error) => {
      console.dir(error);
      return response.status(500).json({ error: 'An error occurred adding the log'});
    });
};

// const updateLog = (_request, _response) => {
//   const request = _request;
//   const response = _response;

//   const taskID = request.body.taskID.toString();
//   const updatedLogDesc = request.body.logDesc.toString();
//   const updatedLogTime = request.body.logTime;

//   const search = { user: request.user._id, _id: taskID };

// }

const toggleComplete = (_request, _response) => {
  const request = _request;
  const response = _response;

  return Task.findOne({ user: request.user._id, _id: request.body.id })
    .select('category title time effort focus complete startDate dueDate')
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
      return response.status(500).json({error: 'An error occurred completing the task'});
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
      return response.status(200).json({ task: updatedTask });
    })
    .catch((error) => {
      console.dir(error);
      return response.status(500).json({ error: 'An error occurred changing the task category' });
    });
};

module.exports.createTask = createTask;
module.exports.getTasks = getTasks;
module.exports.updateTask = updateTask;
module.exports.addLog = addLog;
module.exports.toggleComplete = toggleComplete;
module.exports.changeCategory = changeCategory;
