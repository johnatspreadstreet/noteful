'use strict';

const express = require('express');
const {PORT} = require('./config');
const {logging} = require('./middleware/logger');
const queryString = require('query-string');
const app = express();

// Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

// Load static files
app.use(express.static('public'));

// Add proper logging functionality
app.use(function(req, res, next) {
  logging(req, res, next);
});

console.log('Hello Noteful!');

// 1st GET request
app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

// Return specific notes based on ID
app.get('/api/notes/:id', (req, res, next) => {
  // const params = req.params;
  // const id = params.id;
  
  // const note = data.find(item => item.id === Number(id));

  // console.log(note);
  const {id} = req.params;

  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    res.json(item);
  });
  console.log(id);
  // res.send(note);
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