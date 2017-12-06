/*
 * CS 50 - Library for All
 */

// Modules
var express = require('express');
var mysql = require('mysql');
var config = require('config');
var https = require('https');
var fs = require('fs');
var path = require('path');

// Global Variables
var con = mysql.createConnection(config.get('db'));
var portno = 3000;   // Port number to use
var app = express();

app.use(express.static(__dirname));

// Get a list of all the books
app.get('/books', function(request, response) {
  con.query('SELECT DISTINCT books.id, books.title, books.publisher, book_covers.path as cover_path \
    FROM books \
    JOIN book_covers ON books.id=book_covers.book_id', function (err, result) {
    if (err) {
      response.status(500).end(JSON.stringify({error: "SQL error occured while getting books"}));
      return;
    }
    var books = JSON.parse(JSON.stringify(result));
    fs.readdir(config.get('localPrefix'), (err, files) => {
      if (err) {
        response.status(500).end(JSON.stringify({error: "Error reading downloaded books"}));
        return;
      }
      var ids = files.map(function (fileName) {
        return path.parse(fileName).name;
      });
      books.filter(function (book) {
        if (ids.includes(String(book.id))) {
          book.downloaded = true;
        }
      });
      response.send(books);
    });
  });
});

app.get('/books/:id', function(request, response) {
  var id = request.params.id;
  con.query('SELECT books.id, books.title, books.publisher, book_covers.path as cover_path \
  FROM books \
  JOIN book_covers ON books.id=book_covers.book_id WHERE books.id = ?', [id], function(error, result) {
    if (error || result.length === 0) {
      console.log(error);
      response.status(404).end(JSON.stringify({error: "Book with id " + id + " does not exist"}));
      return;
    }

    console.log(result[0]);
    response.send(result[0]);
  });
});

//get book title with given id
app.get('/book_title/:id', function(request, response) {
  var id = request.params.id;
  con.query("SELECT title FROM books WHERE id = ?", [id], function(error, result) {
    if (error) {
      console.log(error);
      response.status(404).end(JSON.stringify({error: "could not find book with specified id"}));
      return;
    }

    console.log(result[0].title);
    response.send({title: result[0].title});
  });
});

var server = app.listen(portno, function () {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
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
    if (err) {
      response.status(500).end(JSON.stringify({error: "SQL error when querying book"}));
      return;
    }
    response.send(result[0]);
    // save book to ./resources/{book.id}.epub
    var path = config.get('localPrefix') + request.params.id + '.' + result[0].path.split('/').pop().split('.').pop();
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

app.get('/books/by_title/:title', function(request, response) {
  var title = request.params.title;
  con.query('SELECT DISTINCT books.id, books.title, books.publisher, book_covers.path as cover_path \
  FROM books \
  JOIN book_covers ON books.id=book_covers.book_id WHERE books.title LIKE ?', ['%' + title + '%'], function(error, result) {
    if (error) {
      console.log(error);
      response.status(500).end(JSON.stringify({error: "SQL error occured."}));
      return;
    }

    console.log(result);
    response.send(result);
  });
});

app.get('/downloaded_books', function(request, response) {
  fs.readdir(config.get('localPrefix'), (err, files) => {
    var ids = files.map(function (fileName) {
      return path.parse(fileName).name;
    });
    con.query('SELECT DISTINCT books.id, books.title, books.publisher, book_covers.path as cover_path \
    FROM books \
    JOIN book_covers ON books.id=book_covers.book_id WHERE books.id IN ?', [[ids]], function(error, result) {
      if (error) {
        console.log(error);
        response.status(500).end(JSON.stringify({error: "SQL error occured."}));
        return;
      }
  
      console.log(result);
      response.send(result);
    });
  })
});
