/**
 *
 **/
var api = require('./app'),
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

app.get('/api/users/activate', (req, res) => {
});

app.get('/api/users', (req, res) => {
  User.find().exec((err, collection) => {
    res.json({
      success: (!err),
      count: collection.length,
      collection: collection.map(d => d.serialize())
    });
  });
});

app.post('/api/users', (req, res) => {
  var rst = {
    success: false,
    message: 'empty fn'
  };

  console.log(req.body);

  var user = new User({
    _id: null,
    username: req.body.username,
    name: req.body.name,
    active: req.body.active
  });

  user.save().then(
    () => {
      rst.success = true;
      rst.message = 'dado persistido com sucesso.';
      rst.instance = user.serialize();

      res.json(rst);
    },
    (err) => {
      rst.message = err;
      res.json(rst);
    }
  );
});

app.put('/api/users', (req, res) => {
  var rst = {
    success: false,
    message: 'nada foi feito ainda'
  };

  rst.filters = req.body.filters;
  User.update(req.body.filters, req.body.update, {multi: true}).then(
    () => {
      rst.success = true;
      rst.message = 'itens atualizados com sucesso';
      res.json(rst);
    },
    (err) => {
      rst.message = err;
      res.json(rst);
    }
  );
});

app.put('/api/users/:id', (req, res) => {
  var rst = {
    success: false,
    message: 'nada foi feito ainda'
  };

  User.findByIdAndUpdate().then(
    () => {
      rst.success = true;
      rst.message = 'item atualizado com sucesso.';
      res.json(rst);
    },
    (err) => {
      rst.message = err;
      res.json(rst);
    }
  );
});

app.delete('/api/users', (req, res) => {
  var rst = {
    success: false,
    message: 'nada foi feito ainda'
  };

  User.remove(req.body.filters).then(
    (collection) => {
      rst.success = true;
      rst.collection = collection;
      rst.query = req.body.filters;

      res.json(rst);
    },
    (err) => {
      res.json(rst);
    }
  );

});

app.delete('/api/users/:id', (req, res) => {
  var rst = {
    success: false,
    message: 'nada foi feito ainda!'
  };

  console.log('remove user with id %s', req.params.id);
  User.remove({_id: req.params.id}).then(
    () => {
      console.log('done');

      rst.success = true;
      rst.message = 'removido com sucesso.';
      res.json(rst);
    },
    (err) => {
      console.log('err');
      console.log(err);

      rst.message = err;
      res.json(rst);
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
