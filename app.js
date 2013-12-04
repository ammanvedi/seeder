
/**
 * Module dependencies.
 */
var express = require('express');
var app = express();
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http').createServer(app);
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var io = require('socket.io').listen(http);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

http.listen(3000);
console.log('listening on port ' + app.get('port'))

MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function(err, db) {
  if(!err) {
    console.log("database : connected to MongoDB");
  }
     });

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/users', user.list);



//server side socket connection reciever
io.sockets.on('connection', function (socket) {

	console.log('server : sent id ' + socket.id + ' to client');
	socket.emit('hs_id', {data: socket.id});

socket.on('savegraph', function (data) {
    console.log('server : recieved ' + data.data + ' from ' + socket.id);

    //do database connection and saving here



  });

});


  

