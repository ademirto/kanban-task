
var api = require('./app'),
    Restful = require('./rest').Restful,
    RestfulController = require('./rest').RestfulController,
    db = api.db(),
    app = api.app,
    settings = api.settings;

var taskSchema = new db.Schema({
  title: {type: String, unique: true, required: true},
  description: {type: String},
  stage: {type: db.SchemaTypes.ObjectId, ref: 'Stage'},
  resource: {type: db.SchemaTypes.ObjectId, ref: 'User', default: null},
  column: {type: Number, min: 0, max: 4, default: 0}
});

taskSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    stage: this.stage,
    resource: this.resource
  };
};

var Task = db.model('Task', taskSchema);

RestfulController.factory('/api/tasks', app, Task);

module.exports.Task = Task;
module.exports.taskSchema = taskSchema;
