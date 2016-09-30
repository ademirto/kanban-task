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

UserSchema.methods = {
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
        firstName: req.body.firstName,
        lastName: req.body.lastName
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

app.get('/api/users/activate', (req, res) => {});

app.get('/api/users/session', (req, res) => {
  var rst = {
    success: false,
    isAuthenticated: false,
    username: null,
    fullName: null
  };

  res.json(rst);
});

RestfulController.factory('/api/users', app, User);
