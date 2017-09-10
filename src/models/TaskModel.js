const mongoose = require('mongoose');

mongoose.Promise = global.Promise;  // Use default promise library

let TaskModel = {};

const TaskSchema = new mongoose.Schema({
  /*
  Tasks need:
    Name:
      Friendly name
    Description:
      Description of task
    CompletionTime:
      How many hours/minutes this task is expected to take
    LoggedTime:
      How many hours/minutes have been logged against this task
    Status:
      Whether the task is active, complete, or abandoned
    Owner/User:
      The Account this task is tied to
   */

  id: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
    default: mongoose.Types.ObjectId
  },

  title: {
    type: String,
    trim: true,
    required: true,
  },

  // <!--description: {
  //   type: String,
  //   trim: true,
  // },

  // time: {
  //   type: Number,
  //   min: 0,
  //   max: 3,
  //   required: true,
  //   default: 0,
  // }

  // effort: {
  //   type: Number,
  //   min: 0,
  //   max: 3,
  //   required: true,
  //   default: 0,
  // }

  // focus: {
  //   type: Number,
  //   min: 0,
  //   max: 3,
  //   required: true,
  //   default: 0,
  // }

  // startDate: {
  //   type: Date,
  // }

  // dueDate: {
  //   type: Date,
  // }

  // reminder: {
  //   type: Boolean,
  //   default: false,
  // }

  // *
  //  * Specifies how far in advance to remind the user
  //  * values are in days and should be 1, 2, 3, and 7
   
  // reminderPeriod: {
  //   type: Number,
  //   min: 1,
  //   max: 7,
  //   default: 0,
  // }

  // /**
  //  * Work log
  //  */
  // history: {
  //   type: Array,
  //   default: [],
  // }

  // estimatedTime: {
  //   type: Number,
  //   min: 0,
  //   default: 0,
  // }

  // lastWorkedDate: {
  //   type: Date,
  // }

  // category: {
  //   type: String,
  //   trim: true,
  // }

  // status: {
  //   type: String,
  //   required: true,
  //   default: 'active',
  // }

  // owner: {
  //   type: mongoose.Schema.ObjectId,
  //   required: true,
  //   ref: 'User',
  // },-->
});

TaskSchema.statics.findTasks = (callback) => {
  return TaskModel.find().select('title').exec(callback);
}

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;
