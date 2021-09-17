var express = require('express');
var app = express();

app.use(async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //res.header('Access-Control-Allow-Credentials', true);
  next()
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/slow', function (req, res) {
  setTimeout(() => {
    res.setHeader('Content-Type', 'text/plain')
    res.send('i am test plain');
  }, 5000);
});

app.get('/json', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.json({ msg: 'i am json content' });
});

app.post('/post-form-url', function (req, res) {
  res.json(req.body);
});

app.post('/post-json', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.json(req.body);
});

app.listen(5000, () => {
  console.log('server running 5000');
})