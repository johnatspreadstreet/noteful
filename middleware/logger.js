'use strict';

// const express = require('express');
// const morgan = require('morgan');

// const app = express();

// app.use(morgan(':date[web] :method :url'));

const logging = function(req, res, next) {
  const date = new Date();
  const method = req.method;
  const path = req.path;
  console.log(date, method, path);
  next();
};

module.exports = {
  logging
};