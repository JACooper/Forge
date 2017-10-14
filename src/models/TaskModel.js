const mongoose = require('mongoose');

mongoose.Promise = global.Promise;  // Use default promise library

let TaskModel = {};

const TaskSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },

  category: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Category',
  },

  title: {
    type: String,
    trim: true,
    required: true,
  },

  time: {
    type: Number,
    min: 1,
    max: 3,
    required: true,
    default: 0,
  },

  effort: {
    type: Number,
    min: 1,
    max: 3,
    required: true,
    default: 0,
  },

  focus: {
    type: Number,
    min: 1,
    max: 3,
    required: true,
    default: 0,
  },

  complete: {
    type: Boolean,
    default: false,
  },

  startDate: {
    type: Date,
  },

  dueDate: {
    type: Date,
  },

  log: {
    type: Array,
    default: [],
  }

  // notes: {
  //   type: String,
  //   trim: true,
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

  // status: {
  //   type: String,
  //   required: true,
  //   default: 'active',
  // },
});

TaskSchema.statics.findTasksByUser = (userID, callback) => {
  return TaskModel.find({ user: mongoose.Types.ObjectId(userID) })
    .populate('category')
    .exec(callback);
};

// TaskSchema.statics.findTasksByCategory = (categoryID, callback) => {
//   return TaskModel.find({ category: mongoose.Types.ObjectId(categoryID) })
//     .select('title time effort focus complete startDate dueDate')
//     .exec(callback);
// };

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;
