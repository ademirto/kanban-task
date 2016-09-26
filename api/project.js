
var api = require('./app'),
    Restful = require('./rest').Restful,
    RestfulController = require('./rest').RestfulController,
    db = api.db(),
    app = api.app,
    settings = api.settings;

var projectSchema = new db.Schema({
  title: {type: String, required: true, unique: true},
  description: String,
  active: {type: Boolean, default: true}
});

projectSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    active: this.active
  };
};

var Project = db.model('Project', projectSchema);

RestfulController.factory('/api/projects', app, Project);

module.exports.Project = Project;
