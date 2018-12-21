'use strict';

const express = require('express');
const {PORT} = require('./config');
const notesRouter = require('./router/notes.router');
const morgan = require('morgan');
const app = express();

// Load static files
app.use(express.static('public'));

// Parse request body
app.use(express.json());

// Add proper logging functionality
app.use(morgan('dev'));

console.log('Hello Noteful!');

// Add router for notes
app.use('/api', notesRouter);

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
if (require.main === module) {
  app.listen(PORT, function() {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', function(err) {
    console.error(err);
  });
}

module.exports = app;