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
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({
    secret: 'supersecret'
}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//this is for development, when the user login has been impleented 
//the cookie with this data will be replaced by a client specific
//dataset passed through login
var defaultuser = new Object();
defaultuser.username = "admin-amman";
defaultuser.id = "0407av94";
defaultuser.email = "amman.vedi@gmail.com";
defaultuser.profilepage = "http://www.google.com";


http.listen(DEPLOYPORT);
console.log('listening on port ' + app.get('port'))

MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function (err, db) {
    if (!err) {
        console.log("database : connected to MongoDB");
        db.createCollection('graphs', function (err, collection) {});
    }
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/build', function (req, res) {


    res.cookie('seederuser', JSON.stringify(defaultuser), {
        maxAge: 3600000,
        path: '/',
        secret: 'supersecret'
    });

    res.render('index', {
        title: 'Seeder'
    });


    res.end(200);

});

app.post('/hook', function (req, res) {

});

app.get('/users', user.list);

app.get('/explore', explore.explore);

//server side socket connection reciever
io.sockets.on('connection', function (socket) {

	socket.on('USER_SAVEGRAPH', function (data){
		console.log('server : user with id' + data.payload.graphname + ' requested graph save');
		db_push_graph(data.payload)
	});
});

function db_push_graph(fullgraph) {

    MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function (err, db) {
        if (!err) {
            console.log("database : connected to MongoDB");
            db.createCollection('usergraphs', function (err, collection) {

                console.log('insert with id ' + fullgraph.graphid);
                collection.update({graphid:fullgraph.graphid}, fullgraph,{upsert:true}, function (er,res){
                console.log(res);
                });

            });
        }
    });

}