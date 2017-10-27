/*
 * A simple Node.js program for exporting the current working directory via a webserver listing
 * on a hard code (see portno below) port
 */

var express = require('express');
var portno = 3000;   // Port number to use
var app = express();
app.use(express.static(__dirname));


app.get('/', function (request, response) {
  response.end('Simple web server of files from ' + __dirname);
});


function getBookDataForBookWithId(id) {
  if(id % 2 === 0) {
    return "Hello this is the text for book " + id
  }
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


var server = app.listen(portno, function () {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});

/*var mysql = require('mysql');*/

/*var con = mysql.createConnection({
  host: "10.37.165.93",
  user: "root",
  password: "webdevin",
  database: "CS50"
});*/

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
