'use strict';

function formatDate(d){
  var year = d.getFullYear();
  var month = addLeadingZero(d.getMonth());
  var day = addLeadingZero(d.getDay());
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

function addLeadingZero(n){ 
  return n < 10 ? '0'+n : ''+n; 
}

const logging = function(req, res, next) {
  let date = new Date();
  let displayDate = formatDate(date);
  const {method, originalUrl} = req;
  console.log(displayDate, method, originalUrl);
  next();
};

module.exports = {
  logging
};