

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

var RestfulController = function(path, app, model, customRoutes) {
  this._app = app;
  this._model = model;
  this._path = path;
  this._customRoutes = customRoutes;
};

RestfulController.prototype = {

  defaultRouters: {
    get: {
      method: 'GET'
    },
    all: {
      method: 'GET',
      path: ':id'
    },
    update: {
      method: 'PUT'
    },
    updateAll: {
      method: 'PUT',
      path: ':id'
    },
    remove: {
      method: 'DELETE'
    },
    removeAll: {
      method: 'DELETE',
      path: ':id'
    }
  },

  register: function(conf) {
    var routeMap = {
      'GET': this._app.get,
      'PUT': this._app.put,
      'POST': this._app.post,
      'DELETE': this._app.delete,
    };

    var path;
    var method = (routeMap[conf.method] || false);

    if(conf.path) path = [this._path, conf.path].join('/');
    else path = this._path;

    function notFound(req, res) {
      res.json({
        message: 'method not found'
      });
    }

    function authRequired(req, res, next) {
      console.log('check authentication');
      console.log('free authentication: ', conf.freeAccess || false);
      
      if(!req.user && !(conf.freeAccess || false))
        res.json({
          success: false,
          message: 'acesso negado!'
        });
      else
        next();
    }

    console.log('register method %s for path for %s', conf.method, path);
    method.call(
        this._app,
        path,
        [authRequired, (conf.fn || notFound)]
      );
  },

  prepare: function() {
    var allRoutes = {};
    var attr;

    for(attr in this._customRoutes)
      allRoutes[attr] = this._customRoutes[attr];

    for(attr in this.defaultRouters)
      allRoutes[attr] = (allRoutes[attr] || this.defaultRouters[attr]);

    for(attr in allRoutes)
      this.register(allRoutes[attr]);
  }
};

RestfulController.factory = function(path, app, model, customRoutes) {
  var rest = new Restful(model);

  var defaultRoutes = {
    all: {
      method: 'GET',
      path: null,
      fn: (req, res) => {
        rest.all().then(
          (collection) => {
            res.json({
              success: true,
              message: 'itens recuperados com sucesso.',
              count: collection.length,
              collection: collection.map(d => d.serialize())
            });
          },
          (err) => {
            res.json({
              success: false,
              message: err,
              count: 0,
              collection: []
            });
          }
        );
      }
    },
    get: {
      method: 'GET',
      path: ':id',
      fn: (req, res) => {
        rest.get(req.params.id).then(
          (instance) => {
            var message;

            if(instance)
              message = 'item recuperado com sucesso.';
            else
              message = 'item não encontrado.';

            res.json({
              success: (instance ? true : false),
              message: message,
              instance: (instance ? instance.serialize() : null)
            });
          },
          (err) => {
            res.json({
              success: false,
              message: err,
              instance: null
            });
          }
        );
      }
    },
    create: {
      method: 'POST',
      path: null,
      fn: (req, res) => {
        rest.create(req.body).then(
          (instance) => {
            res.json({
              success: true,
              message: 'dados persistidos com sucesso!',
              instance: instance
            });
          },
          (err) => {
            res.json({
              success: false,
              instance: null,
              message: err
            });
          }
        );
      }
    },
    updateAll: {
      method: 'PUT',
      path: null,
      fn: (req, res) => {
        rest.update(req.body.filters, req.body.data).then(
          (result) => {
            res.json({
              success: (result.n > 0),
              count: result.n,
              message: (result.n > 0) ? 'itens atualizados com sucesso!' : 'nenhum item encontrado para ser atualizado'
            });
          },
          (err) => {
            res.json({
              success: false,
              message: err
            });
          }
        );
      }
    },
    update: {
      method: 'PUT',
      path: ':id',
      fn: (req, res) => {
        rest.update(req.params.id, req.body).then(
          (result) => {
            console.log(result);
            console.log(req.params);
            console.log(req.body);

            res.json({
              success: (result.n > 0),
              count: result.n,
              message: (result.n > 0) ? 'itens atualizados com sucesso!' : 'nenhum item encontrado para ser atualizado.'
            });
          },
          (err) => {
            res.json({
              success: false,
              message: err
            });
          }
        );
      }
    },
    removeAll: {
      method: 'DELETE',
      path: null,
      fn: (req, res) => {
        rest.remove(req.body.filters).then(
          (scope) => {
            res.json({
              count: scope.result.n,
              success: (scope.result.n > 0),
              message: (scope.result.n > 0) ? 'itens removidos com sucesso!' : 'nenhum item encontrado para ser removido.'
            });
          },
          (err) => {
            res.json({
              success: false,
              message: err
            });
          }
        );
      }
    },
    remove: {
      method: 'DELETE',
      path: ':id',
      fn: (req, res) => {
        rest.remove(req.params.id).then(
          (scope) => {
            console.log(scope.result);

            res.json({
              count: scope.result.n,
              success: (scope.result.n > 0),
              message: (scope.result.n > 0) ? 'item removido com sucesso!': 'nenhum item encontrado para remoção.'
            });
          },
          (err) => {
            res.json({
              success: false,
              message: err
            });
          }
        );
      }
    }
  };

  var preparedRoutes = {},
      attr;

  for(attr in customRoutes)
    preparedRoutes[attr] = customRoutes[attr];

  for(attr in defaultRoutes)
    preparedRoutes[attr] = (preparedRoutes[attr] || defaultRoutes[attr]);

  var rc = new RestfulController(path, app, model, preparedRoutes);
  rc.prepare();

  return rc;
};

module.exports.RestfulController = RestfulController;
