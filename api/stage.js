
var api = require('./app'),
    Restful = require('./rest').Restful,
    RestfulController = require('./rest').RestfulController,
    db = api.db(),
    app = api.app,
    settings = api.settings;

var stageSchema = new db.Schema({
  title: {type: String, unique: true, required: true},
  project: {type: db.SchemaTypes.ObjectId, ref: 'Project'}
});

stageSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    project: this.project
  };
};

var Stage = db.model('Stage', stageSchema);

RestfulController.factory('/api/stages', app, Stage);

module.exports.Stage = Stage;
module.exports.stageSchema = stageSchema;
