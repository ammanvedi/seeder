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
var passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy;

// all environments

app.configure(function() {

app.set('port', process.env.PORT || DEPLOYPORT);
app.set('views', path.join(__dirname, 'views'));
app.set('docs', path.join(__dirname, 'docs'));
app.set('view engine', 'jade');
//app.use(express.compress());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public') , { maxAge: 31557600000 }));




app.use(express.cookieSession({
    secret: 'supersecret'
}));

app.use(passport.initialize());
  app.use(passport.session());


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);


});

var UserBase = new Object();



//this is for development, when the user login has been implemented 
//the cookie with this data will be replaced by a client specific
//dataset passed through login
var defaultuser = new Object();
defaultuser.username = "admin-amman";
defaultuser.id = "0407av94";
defaultuser.email = "amman.vedi@gmail.com";
defaultuser.profilepage = "http://www.google.com";


http.listen(DEPLOYPORT);
console.log('listening on port ' + app.get('port'))

var databaseconnection;

//single connection instance creates a connection pool that the server can use whenever
//database interaction is needed
MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function (err, db) {
    if (!err) {
        //console.log("database : connected to MongoDB");
        databaseconnection = db;
        //db.createCollection('graphs', function (err, collection) {});
    }
});

passport.use(new GoogleStrategy({
    returnURL: 'http://seeder.co/auth/google/return',
    realm: 'http://seeder.co/'
  },
  function(identifier, profile, done) {
  
  console.log(identifier + ' is the id');
  
  if(UserBase[identifier]){
  	//user exists 
  	done(0, UserBase[identifier])
  }else{
  	//user does not exist
  	//add
  	profile.id = identifier;
  	UserBase[identifier] = profile;
  	done(0, UserBase[identifier]);
  }
  
  
  }
));

passport.serializeUser(function(user, done) {
console.log('serialize ' + JSON.stringify(user));
  done(0, user.id);
});

passport.deserializeUser(function(id, done) {
console.log('DESERIALIZE');
	if(UserBase[id]){
		console.log('DESERIALIZE success');
		done(null, UserBase[id]);
	}else{
	console.log('DESERIALIZE fail');
		done(null,false);
	}

    
  });
  

  
  


/**
 * Get an array of graph data from the public graphs database 
 * @param      {String}   a string specifying which graphs to return (all, popular, new)
 * @param      {Function} callback will be passed a single argument which contains all graph metadata
 */
function getPublic(filter, next) {

	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    var ItemList = new Array();

    if (filter == 'all') {
    
    	//this should be refactored so only graphmeta is served to the client.

        databaseconnection.createCollection('publicgraphs', function (err, collection) {

            collection.find().toArray(function (err, items) {
                items.forEach(function (obj) {
                	 var pdate = new Date(obj.graphmeta.datecreated);
                	 
                	 obj.graphmeta.datecreated= days[pdate.getDay()] + ' ' + months[pdate.getMonth()] +  ' ' + pdate.getDate();
                    ItemList.push(obj);


                });
                console.log(ItemList);
                next(ItemList);
                //return JSON.stringify(ItemList);
            });

        });
    }

}



// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/help', function (req, res) {

if(req.user){
	res.render('help', {logintext : req.user.name.givenName, signouttext: "Sign Out", title: 'seeder.co - help', signlink:'/logout'});
}else{
	  res.render('help', {logintext : "Sign In", signouttext: "Sign In", title: 'seeder.co - help', signlink: '/auth/google'});
}

		
});


app.get('/auth/google', passport.authenticate('google'));


app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/build',
                                    failureRedirect: '/' }));
                                    
app.get('/graph', function (req, res) {

	databaseconnection.createCollection('publicgraphs', function (err, collection) {
	
		var g;
		collection.findOne({graphid : req.query.graphid}, function (err, items) {
				g = items;
		        if(req.user)
		        {
			      		res.render('graph', {
					    title: 'Seeder',  graphid : req.graphid, username: req.user.name.givenName, signouttext : "Sign Out", gdata: g, signlink: '/logout'
		        		});	
		        	}
		        	else 
		        	{
		        		res.render('graph', {
		        		title: 'Seeder',  graphid : req.graphid, username: "Sign In", signouttext:"Sign In", gdata: g, signlink : '/auth/google'
		        		});
		        }
		 });
	
	});


});                                    

app.get('/build', function (req, res) {

    databaseconnection.createCollection('graphs', function (err, collection) {

        //console.log(collection);
    });


    
    if(req.user){
    console.log(JSON.stringify(req.user) + ' user found' );
    
    var c = new Object();
    
    c.id = req.user.id;
    
    res.cookie('seederuser', JSON.stringify(c), {
        maxAge: 3600000,
        path: '/',
        secret: 'supersecret'
    });
    //render with user details
    res.render('index', {
        title: 'Seeder', username: req.user.name.givenName, signlink: '/logout', signouttext: 'Sign Out'
    });
    }else{
    console.log('no user logged in');
//    res.render('index', {
//        title: 'Seeder',  username: 'Sign In'
//    });

	res.redirect('/auth/google');
    }






});

app.get('/logout', function(req, res){
console.log(JSON.stringify(UserBase[req.user.id]) +'is usr logged out');

req.session = null;
  req.logout();
  res.clearCookie('seederuser', { path: '/' });
  res.clearCookie('connect.sess', { path: '/' });
  res.redirect('/');
});


//app.get('/users', user.list);

app.get('/blog', function (req, res) {

if(req.user){
	res.render('blog', {logintext : req.user.name.givenName, signouttext: "Sign Out", signlink: '/logout'});
}else{
	  res.render('blog', {logintext : "Sign In", signouttext: "Sign In", signlink: '/auth/google'});
}

  
});

app.get('/explore', function (req, res) {




    var exploredata = getPublic('all', function (dta) {
        //socket.emit('EXPLORE_SERVE_RESPONSE', {payload: dta});
        //console.log('got ' + dta);
        
        
        if(req.user){
        	res.render('explore', {
        	    title: 'Explore',
        	    graphs: dta,
        	    len: dta.length,
        	    logintext: req.user.name.givenName,
        	    signouttext: "Sign Out",
        	    signlink: 'logout'
        	    
        	});
        	
        }else{
        	
        }
        
            res.render('explore', {
                title: 'Explore',
                graphs: dta,
                len: dta.length,
                logintext: "Sign In",
                signouttext: "Sign In",
                signlink: '/auth/google'
            });
            
        });
        





});

//server side socket connection reciever
io.sockets.on('connection', function (socket) {

    function respondurl(url_res) {
        
    }


    socket.on('USER_SAVEGRAPH', function (data) {
        //console.log('server : user with id' + data.payload.graphname + ' requested graph save');
        if (data.payload.publish) {
        	console.log(JSON.stringify(UserBase));
        	data.payload.authorname = UserBase[data.payload.author].displayName;
        	console.log('user display name is ' + data.payload.authorname);
            var url = db_push_graph(data.payload, true);
            socket.emit('PUBLISH_SUCCESS', {
                payload: url
            });


        } else {
            //db_push_graph(data.payload, false);
            socket.emit('SAVE_SUCCESS', {
                payload: db_push_graph(data.payload, false)
            });
        }
    });

    //SERVE_EXPLORE_HOMEPAGE

    socket.on('SERVE_EXPLORE_HOMEPAGE', function (data) {
        //console.log('server : user with id' + data.payload.graphname + ' requested graph save');
        //get public graphs and serve back to client
        //database


    });


});

/**
 * Push graph data from the server to the database, called after graph data has been received from a socket connection
 * @param      	{Object}  the graph object 
 * @param      	{Boolean} true/false representing weather the graph should be pushed to the public database
 * @return		{String} returns a uri to the resulting graph
 */
function db_push_graph(fullgraph, public) {

    var url = "http://seeder.co/graph?graphid=" + fullgraph.graphid;

    if (public) {

        //console.log("database : connected to MongoDB");
        databaseconnection.createCollection('publicgraphs', function (err, collection) {

            //console.log('insert with id ' + fullgraph.graphid);
            collection.update({
                graphid: fullgraph.graphid
            }, fullgraph, {
                upsert: true
            }, function (er, res) {
                console.log(res);
            });

        });

    } else {

        //console.log("database : connected to MongoDB");
        databaseconnection.createCollection('usergraphs', function (err, collection) {

            //console.log('insert with id ' + fullgraph.graphid);
            collection.update({
                graphid: fullgraph.graphid
            }, fullgraph, {
                upsert: true
            }, function (er, res) {
                console.log(res);
            });

        });

    }

    return url;

}