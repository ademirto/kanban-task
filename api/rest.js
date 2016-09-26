

var Restful = function(model) {
  this._model = model;
};

Restful.prototype = {
  Model: function() {
    return this._model;
  },

  all: function() {
    return this.Model().find();
  },

  get: function(_id) {
    return this.Model().findById(_id);
  },

  create: function(data) {
    var inst,
        Model = this.Model();

    data._id = null;
    inst = new Model(data);

    return inst.save();
  },

  update: function(conditional, data) {
    if(typeof(conditional) === 'string')
      conditional = {
        _id: conditional
      };

    return this.Model().update(conditional, data, {multi: true});
  },

  remove: function(conditional) {
    if(typeof(conditional) === 'string')
      conditional = {
        _id: conditional
      };

    return this.Model().remove(conditional);
  }
};

module.exports.Restful = Restful;

var RestfulController = function(app, model) {
  this._app = app;
  this._model = model;
};


RestfulController.factory = function(path, app, model) {};

module.exports.RestfulController = RestfulController;
