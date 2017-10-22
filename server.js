'use strict';

/*
 * A simple Node.js program for exporting the current working directory via a webserver listing
 * on a hard code (see portno below) port. To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:3001 will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 */

/* jshint node: true */

var express = require('express');
var mysql = require('mysql');
var config = require('config');
var https = require('https');
var fs = require('fs');
var path = require('path');

var con = mysql.createConnection(config.get('db'));

var portno = 3000;   // Port number to use

var app = express();

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

// Get a list of all the books
app.get('/', function (request, response) {
  con.query("SELECT id, title, publisher FROM books", function (err, result) {
    if (err) throw err;
    response.send(result);
  });
});

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

app.get('/download/:id', function (request, response) {
  con.query("SELECT path FROM book_assets WHERE book_id = ?", [request.params.id], function (err, result) {
    if (err) throw err;
    response.send(result);
    var path = config.get('localPrefix') + result[0].path;
    ensureDirectoryExistence(path);
    var file = fs.createWriteStream(path);
    var link = config.get('remotePrefix') + result[0].path;
    https.get(link, function (response) {
      response.on('data', function (chunk) {
        file.write(chunk);
      });
    }).on('error', function (error) {
      console.error(error);
    });
  });
});

var server = app.listen(portno, function () {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
