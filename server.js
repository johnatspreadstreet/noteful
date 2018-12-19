'use strict';

const express = require('express');
const {PORT} = require('./config');
const {logging} = require('./middleware/logger');
const queryString = require('query-string');
const morgan = require('morgan');
const app = express();

// Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

// Load static files
app.use(express.static('public'));

// Parse request body
app.use(express.json());

// Add proper logging functionality
app.use(morgan('dev'));

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

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
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