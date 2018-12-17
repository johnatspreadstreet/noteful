'use strict';

const express = require('express');
const app = express();

// Load array of notes
const data = require('./db/notes');

// Load static files
app.use(express.static('public'));

console.log('Hello Noteful!');

// 1st GET request
app.get('/api/notes', (req, res) => {
  res.json(data);
});

// Return specific notes based on ID
app.get('/api/notes/:id', (req, res) => {
  const params = req.params;
  const id = params.id;
  
  const note = data.find(item => item.id === Number(id));

  console.log(note);
  res.send(note);
});

// INSERT EXPRESS APP CODE HERE...
app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', function(err) {
  console.error(err);
});