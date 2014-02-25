
/**
 * Module dependencies.
 */


var DEPLOYPORT = 8080; //3000


var express = require('express');
var app = express();
var routes = require('./routes');
var user = require('./routes/user');
var explore = require('./routes/explore');
var http = require('http').createServer(app);
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var io = require('socket.io').listen(http);

// all environments
app.set('port', process.env.PORT || DEPLOYPORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

http.listen(DEPLOYPORT);
console.log('listening on port ' + app.get('port'))

MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function(err, db) {
  if(!err) {
    console.log("database : connected to MongoDB");
    db.createCollection('graphs', function(err, collection) {});
  }
     });

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/hook', function (req,res){

});

app.get('/users', user.list);

app.get('/explore', explore.explore);

//server side socket connection reciever
io.sockets.on('connection', function (socket) {

	var nds;
	var egs;

	console.log('server : sent id ' + socket.id + ' to client');
	socket.emit('hs_id', {data: socket.id});

socket.on('savegraph_nodes', function (data) {
    console.log('server : recieved (nodes) ' + data + ' from ' + socket.id);

    //do database connection and saving here

nds = data;

  });

socket.on('request_pullGraph', function (data){
	console.log('server : client ' + socket.id + ' requesting pull of graph id ' + data.graphID);

	MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function(err, db) {
var collection = db.collection('graphs');
	collection.findOne({"graph.Gmeta.id":data.graphID}, function(err, item) {
	if(err){
		console.log('server : ERROR');
		console.log(err);
	}else{
		console.log("server : pull request successful");
		socket.emit('request_pullGraph_success', {data:item});
	}

});

});

});


socket.on('savegraph_edges', function (data) {
    console.log('server : recieved (edges) ' + data + ' from ' + socket.id);

    //do database connection and saving here

egs = data;

db_push_graph(nds,egs, {id:'123'});

  });



});

function db_push_graph(nodes, edges, meta){

	MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function(err, db) {
  if(!err) {
    console.log("database : connected to MongoDB");
    db.createCollection('graphs', function(err, collection) {

var id = meta.id;

var graph_send = [{graph:[{Gnodes:nodes}, {Gedges:edges}, {Gmeta:meta}]}];

collection.insert(graph_send, function(err, result){
	console.log(result);
});

collection.findOne({"graph.Gmeta.id":"123"}, function(err, item) {
	if(err){
		console.log('server : ERROR');
		console.log(err);
	}else{
		console.log("server : FOUND");
		
	}

});


    });
}
     });

}


  

