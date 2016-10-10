/**
 *
 **/
var api = require('./app'),
    Restful = require('./rest').Restful,
    RestfulController = require('./rest').RestfulController,
    db = api.db(),
    app = api.app,
    settings = api.settings,
    crypto = require('crypto');

var UserSchema = new db.Schema({
  username: {type: String, unique: true, required: true},
  password: String,
  email: {type: String, unique: true, required: true},
  name: {
    firstName: String,
    lastName: String
  },
  active: {type: Boolean, default: true},
  activateToken: {type: String, default: ''}
});

function uuidPart(size) {
    var part = [];
    size = (size || 1);

    while(size > 0) {
        part.push(Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
        size--;
    }

    return part.join('');
}

UserSchema.statics = {
  checkPassword: function(user, password) {
    var eng = crypto.createHash(settings.defaultHash);
    eng.update([
      settings.secret,
      password
    ].join("$"));

    var tpass = eng.digest('hex');
    return User.findOne({email: user, password: tpass});
  }
};

UserSchema.methods = {

  fullName() {
    return [
      this.name.firstName,
      this.name.lastName
    ].join(' ');
  },

  setPassword: function(password, save) {
    save = (save || false);

    var eng = crypto.createHash(settings.defaultHash);
    eng.update([
      settings.secret,
      password
    ].join("$"));

    this.password = eng.digest('hex');

    if(save && this._id)
      return User.update(this._id, {password: this.password});
    else if(save && !this._id)
      throw 'Não posso salvar a senha se o usário não foi persistido';
  },
  createActivateToken: function() {
    this.activateToken = [
        uuidPart(2),
        uuidPart(),
        uuidPart(),
        uuidPart(),
        uuidPart(3)
    ].join('-');
  },
  serialize: function() {
    return {
      id: this.id,
      username: this.username,
      name: this.name,
      active: this.active,
      activateToken: this.activateToken,
      email: this.email
    };
  }
};

var User = db.model('User', UserSchema);

module.exports = {
  User: User,
  userSchema: UserSchema
};

var rest = new Restful(User);

app.post('/api/users/register', (req, res) => {
  var rst = {
    success: false,
    message: 'nada foi feito ainda'
  };

  rst.debug = {
    body: req.body
  };

  if(req.body.password !== req.body.confirmPassword) {
    rst.message = 'Password não pode ser confirmado';
    res.json(rst);
  }
  else {
    var user = new User({
      username: req.body.username,
      name: {
        firstName: (req.body.firstName || req.body.firstname),
        lastName: (req.body.lastName || req.body.lastname)
      },
      active: false,
      email: req.body.email
    });

    user.setPassword(req.body.password);
    user.createActivateToken();

    user.save().then(
      (instance) => {
        rst.success = true;
        rst.message = 'Usuário registrado com sucesso, mas precisa ser ativado.';
        rst.instance = user.serialize();

        res.json(rst);
      },
      (err) => {
        rst.message = err;
        res.json(rst);
      }
    );
  }
});

app.get('/api/users/activate/:token', (req, res) => {
  var rst = {
    success: false,
    message: 'nada foi feito ainda'
  };

  User.update({active: false, activateToken: req.params.token}, {active: true, activateToken: null}, {multi: false}).then(
    (result) => {
      rst.success = (result.n > 0);
      rst.message = (rst.success ? 'Usuário ativado com sucesso.' : 'Código de ativação não existe!');
      res.json(rst);
    },
    (err) => {
      rst.message = err;
      res.json(rst);
    }
  );

});

var userSession = function(options) {
  return function(req, res, next) {
    if(!req.user && req.session.userId)
      User.findOne({_id: req.session.userId}).then(
        (user) => {
          req.user = user;
          next();
        },
        (err) => {
          req.user = undefined;
          next();
        }
      );
      else
        next();
    };
};

app.use(userSession());

app.get('/api/users/session', (req, res) => {
  var rst = {
    success: false,
    isAuthenticated: (req.user ? true : false)
  };

  if(rst.isAuthenticated) {
    rst.username = req.user.username;
    rst.fullName = req.user.fullName();
  }

  res.json(rst);
});

app.post('/api/users/signIn', (req, res) => {
  var rst = {
    success: false,
    message: 'usuário não identificado.'
  };

  User.checkPassword(req.body.email, req.body.password).then(
    (user) => {
      if(user) {
        req.session.userId = user._id;
        rst.success = true;
        rst.message = 'usuário autenticado com sucesso.';
      }
      else
        rst.message = 'usuário ou senha inválidos.';

        res.json(rst);
    },
    (err) => {
      req.session.userId = false;
      rst.message = err;
      res.json(rst);
    }
  );

});

app.post('/api/users/signOut', (req, res) => {
  var rst = {
    success: false,
    message: 'usuário não estava logado.'
  };

  if(req.user && req.session.userId) {
    rst.success = true;
    rst.message = `O usuário ${req.user.fullName()} efetuou a saída com sucesso.`;

    req.user = req.session.userId = undefined;
  }

  res.json(rst);
});

RestfulController.factory('/api/users', app, User);
