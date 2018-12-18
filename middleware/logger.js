'use strict';

// const express = require('express');
// const morgan = require('morgan');

// const app = express();

// app.use(morgan(':date[web] :method :url'));

const logging = function(req, res, next) {
  const date = new Date();
  const method = req.method;
  const path = req.path;
  const query = req.query;
  const searchTerm = query.searchTerm;
  console.log(date, method, path, searchTerm);
  next();
};

module.exports = {
  logging
};