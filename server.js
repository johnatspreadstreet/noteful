'use strict';

const express = require('express');
const {PORT} = require('./config');
const {logging} = require('./middleware/logger');
const app = express();

// Load array of notes
const data = require('./db/notes');

// Load static files
app.use(express.static('public'));

app.use(function(req, res, next) {
  logging(req, res, next);
});

console.log('Hello Noteful!');

// 1st GET request
app.get('/api/notes', (req, res) => {
  const query = req.query;
  const searchTerm = query.searchTerm;

  const filteredData = data.filter(item => {
    let string = item.title;  
    return string.includes(searchTerm);
  });

  if (searchTerm === undefined) {
    res.json(data);
  } else {
    res.json(filteredData);
  }
});

// Return specific notes based on ID
app.get('/api/notes/:id', (req, res) => {
  const params = req.params;
  const id = params.id;
  
  const note = data.find(item => item.id === Number(id));

  console.log(note);
  res.send(note);
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({message: 'Not Found'});
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// INSERT EXPRESS APP CODE HERE...
app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', function(err) {
  console.error(err);
});