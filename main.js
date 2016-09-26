/**
 *
 **/
var api = require('./api/app');
var app = api.app;

api.boot({
  htdocs: __dirname,
  secret: '@@$%asda1sd9a1s981erfvd81%&&',
  installed: [
    './user',
    './project',
    './stage'
  ]
});

app.get('/count', (req, res) => {
  if(!req.session.rate) req.session.rate = 0;
  res.json({
    sId: req.sessionID,
    rate: (++req.session.rate)
  });
});
