
var api = require('./app'),
    Restful = require('./rest').Restful,
    RestfulController = require('./rest').RestfulController,
    db = api.db(),
    app = api.app,
    settings = api.settings;

var stageSchema = new db.Schema({
  title: {type: String, unique: true, required: true}
});

stageSchema.methods.serialize = function() {
  return {
    title: this.title
  };
};

var Stage = db.model('Stage', stageSchema);

RestfulController.factory('/api/stage', app, Stage);

module.exports.Stage = Stage;
