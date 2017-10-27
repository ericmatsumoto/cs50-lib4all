/*
 * A simple Node.js program for exporting the current working directory via a webserver listing
 * on a hard code (see portno below) port
 */

var express = require('express');
var mysql = require('mysql');
var config = require('config');
var https = require('https');
var fs = require('fs');
var path = require('path');
var con = mysql.createConnection(config.get('db'));
var portno = 3000;   // Port number to use
var app = express();
app.use(express.static(__dirname));

// Get a list of all the books
app.get('/', function (request, response) {
  con.query("SELECT id, title, publisher FROM books", function (err, result) {
    if (err) throw err;
    response.send(result);
  });
});

function getBookDataForBookWithId(id) {
  if(id % 2 === 0) {
    return "Hello this is the text for book " + id
  }
}

function getBookTitleForBookWithId(id) {
  con.query("select title from books where id = " + id + ";", function(error, result){
    if (error) {
      console.log(error);
    } else {
      console.log(result[0].title);
      return result[0].title;
    }
  });
}

app.get('/book/:id', function(request, response) {
  var id = request.params.id;
  var bookText = getBookDataForBookWithId(id)
  if(!bookText) {
    response.status(404).end("Book with id " + id + " does not exist");
    return;
  }
  response.end(JSON.stringify({book : bookText, id : id}));
});

//get book title with given id
app.get('/book_title/:id', function(request, response) {
  var id = request.params.id;
  con.query("select title from books where id = " + id + ";", function(error, result){
    if (error) {
      console.log(error);
      response.end("could not find book with id");
    } else {
      console.log(result[0].title);
      response.end(result[0].title);
    }
  });
})

app.post('/test_database', function(request, response){
  console.log('antyaldfgadf');
  con.query("select title from books where id = 1;", function(error, result){
    if (error) {
      console.log(error);
    } else {
      console.log(result);
    }
  })
  response.end("wo00000w");
});


var server = app.listen(portno, function () {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});

/*con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("select link from books where id=1", function (err, result) {
   if (err) throw err;
   var link = JSON.parse(JSON.stringify(result, null, 2));
   console.log("Result: " + JSON.stringify(result, null, 2));
   console.log(link);
 });
});*/



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
