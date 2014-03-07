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

function getPublic(filter, next){

	var ItemList = new Array();

	if(filter == 'all'){
	
	MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function (err, db) {
	        if (!err) {
	            db.createCollection('publicgraphs', function (err, collection) {
	
					collection.find().toArray(function(err, items) {
						items.forEach(function (obj){
							ItemList.push(obj);
							
							
						});
						console.log(ItemList);
						next(ItemList);
						//return JSON.stringify(ItemList);
					});
	
	            });
	        }
	    });
	
		
		
	}
	
}



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

app.get('/blog',  function(req, res){
	res.render('blog', {});
});

app.get('/explore', function(req, res){


var exploredata = getPublic('all', function (dta){
	//socket.emit('EXPLORE_SERVE_RESPONSE', {payload: dta});
	console.log('got ' + dta);
	res.render('explore', { title: 'Explore', graphs: dta, len: dta.length });
});


  
});

//server side socket connection reciever
io.sockets.on('connection', function (socket) {

	socket.on('USER_SAVEGRAPH', function (data){
		console.log('server : user with id' + data.payload.graphname + ' requested graph save');
		if(data.payload.publish){
		db_push_graph(data.payload, true);
		}else{
		db_push_graph(data.payload, false);
		}
	});
	
	//SERVE_EXPLORE_HOMEPAGE
	
	socket.on('SERVE_EXPLORE_HOMEPAGE', function (data){
		//console.log('server : user with id' + data.payload.graphname + ' requested graph save');
		//get public graphs and serve back to client
		//database

		
	});
	

});

function db_push_graph(fullgraph, public) {

if(public){
    MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function (err, db) {
        if (!err) {
            console.log("database : connected to MongoDB");
            db.createCollection('publicgraphs', function (err, collection) {

                console.log('insert with id ' + fullgraph.graphid);
                collection.update({graphid:fullgraph.graphid}, fullgraph,{upsert:true}, function (er,res){
                console.log(res);
                });

            });
        }
    });
    }else{
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

}