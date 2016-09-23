/**
 *
 **/
var express = require('express') ,
    app = express(),
    session = require('express-session'),
    cookieParse = require('cookie-parser'),
    MemoryCache = require('connect-memcached')(session),
    bodyParse = require('body-parser'),
    defaultSettings = require('./settings').defaultSettings;

module.exports = {
  /**
   * for use in external packages.
   **/
  app: app,

  prepareSettings: function(settings) {
    for(var attr in defaultSettings)
      settings[attr] = (settings[attr] || defaultSettings[attr]);
  },

  boot: function(settings) {
    this.prepareSettings(settings);

    app.use(bodyParse.json());
    app.use(bodyParse.urlencoded({extended: true}));
    app.use(cookieParse(settings.secret));
    app.use(session({
      secret: settings.secret,
      saveUninitialized: true,
      resave: false,
      name: 'sessionID',
      cookie: {
        maxAge: 600000,
      },
      store: new MemoryCache({
        hosts: ['cache:11211'],
        secret: settings.secret
      })
    }));

    app.use('/', express.static(settings.htdocs));
    app.listen(settings.httpPort, () => {
      console.log('server now is ready');
      console.log('listen port %d', settings.httpPort);
    });
  }
};
