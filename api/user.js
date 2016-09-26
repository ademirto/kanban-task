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
    console.log(this);

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
  User: User
};

var rest = new Restful(User);

RestfulController.factory('/api/users', app, User);

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

app.get('/api/users', (req, res) => {
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
});

app.get('/api/users/:id', (req, res) => {
  rest.get(req.params.id).then(
    (instance) => {
      res.json({
        success: true,
        message: 'item recuperado com sucesso.',
        instance: instance.serialize()
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
});

app.post('/api/users', (req, res) => {
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
});

app.put('/api/users', (req, res) => {
  rest.update(req.body.filters, req.body.data).then(
    (result) => {
      console.log(result);

      res.json({
        success: true,
        count: result.n,
        message: 'itens atualizados com sucesso!'
      });
    },
    (err) => {
      res.json({
        success: false,
        message: err
      });
    }
  );
});

app.put('/api/users/:id', (req, res) => {
  rest.update(req.params.id, req.body.data).then(
    (result) => {
      console.log(result);

      res.json({
        success: true,
        count: result.n,
        message: 'itens atualizados com sucesso!'
      });
    },
    (err) => {
      res.json({
        success: false,
        message: err
      });
    }
  );
});

app.delete('/api/users', (req, res) => {
  rest.remove(req.body.filters).then(
    (result) => {
      res.json({
        success: true,
        message: 'itens removidos com sucesso!'
      });
    },
    (err) => {
      res.json({
        success: false,
        message: err
      });
    }
  );
});

app.delete('/api/users/:id', (req, res) => {
  rest.remove(req.params.id).then(
    (result) => {
      res.json({
        success: true,
        message: 'item removido com sucesso!'
      });
    },
    (err) => {
      res.json({
        success: false,
        message: err
      });
    }
  );
});

app.get('/api/users/session', (req, res) => {
  var rst = {
    success: false,
    isAuthenticated: false,
    username: null,
    fullName: null
  };

  res.json(rst);
});
