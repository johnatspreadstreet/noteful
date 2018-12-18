'use strict';

const logging = function(req, res, next) {
  let now = new Date();
  let date = now.toLocaleDateString();
  let time = now.toLocaleTimeString();
  // let displayDate = formatDate(date);
  const {method, originalUrl} = req;
  console.log(date, time, method, originalUrl);
  next();
};

module.exports = {
  logging
};