'use strict';

const express = require('express');
const app = express();

// Load array of notes
const data = require('./db/notes');

// Load static files
app.use(express.static('public'));

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', function(err) {
  console.error(err);
});