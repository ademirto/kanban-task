var express = require('express') ,
    app = express(),
    session = require('express-session'),
    cookieParse = require('cookie-parser'),
    MemoryCache = require('connect-memcached')(session),
    bodyParse = require('body-parser');


app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));
app.use(cookieParse('asdfghj'));
app.use(session({
  secret: '123456789',
  saveUninitialized: true,
  resave: false,
  store: new MemoryCache({
    hosts: ['cache:11211'],
    secret: '1234567'
  })
}));

app.use('/', express.static('.'));
app.get('/test', (req, res) => {
  if(!req.session.rate)
    req.session.rate = 0;

  req.session.rate++;

  res.json({
    success: true,
    sid: req.session.id,
    rate: req.session.rate
  });
});

app.listen(3000, () => {
  console.log('server now is ready');
});
