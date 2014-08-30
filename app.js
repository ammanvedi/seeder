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
var Mendeley = require('mendeleyjs');
var seedling = require('seedling');

// all environments

app.configure(function() {

    app.set('port', process.env.PORT || DEPLOYPORT);
    app.set('views', path.join(__dirname, 'views'));
    app.set('docs', path.join(__dirname, 'docs'));
    app.set('view engine', 'jade');
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, 'public'), {
        maxAge: 31557600000
    }));
    app.use(express.cookieSession({
    		key: 'seeder.sess',
        secret: 'supersecret'
    }));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
});

//testing mendeley js functionality

Mendeley.auth('670', '9N5Q9XupUZEpxuOI', function(msg) {
    console.log(msg)
    Mendeley.search("science", function(data) {
        console.log(data);
    });
});



http.listen(DEPLOYPORT);
console.log('listening on port ' + app.get('port'))

var databaseconnection;

//single connection instance creates a connection pool that the server can use whenever
//database interaction is needed
MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function(err, db) {
    if (!err) {
        //console.log("database : connected to MongoDB");
        databaseconnection = db;
        //db.createCollection('graphs', function (err, collection) {});
        seedling.init(databaseconnection);
    }
});






// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);



app.get('/help', function(req, res) {

    if (req.session.user) {
        res.render('help', {
            logintext: req.session.user.name.givenName,
            signouttext: "Sign Out",
            title: 'seeder.co - help',
            signlink: '/logout'
        });
    } else {
        res.render('help', {
            logintext: "Sign In",
            signouttext: "Sign In",
            title: 'seeder.co - help',
            signlink: '/login'
        });
    }


});


app.get('/login', function(req,res){

	res.render('login', {
	    logintext: "Sign In",
	    signouttext: "Sign In",
	    title: 'Login',
	    signlink: '/login'
	});

});


app.post('/login', function(req, res) {

    seedling.verifyAuthPair(req.body.uname, req.body.pass, function(result, code) {

        console.log(result);

        if (code) {
            //success
            req.session.loggedin = true;
            
            var userobj = new Object();
            userobj.name = new Object();
            
            userobj.id = result.id;
            userobj.name.givenName = result.firstname;
            userobj.name.displayName = result.firstname + ' ' + result.lastname;
            
            req.session.user = userobj;
            
            console.log('usr :' + userobj);
            
            res.send(200);
            
        } else {
            //failure, respond accordingly
            res.send(400);
        }
    });
});

app.get('/signup', function(req,res){
	
	if(req.session.loggedin){
		console.log('USER LOGGED IN ALREADY');
	}
	res.render('signup', {
	    logintext: "Sign In",
	    signouttext: "Sign In",
	    title: 'seeder.co - Sign Up',
	    signlink: '/login'
	});

});

app.post('/signup', function(req, res) {
    //console.log(req.query);
//console.log(req.body);

    seedling.registerUser(req.body.uname, req.body.fname, req.body.sname, req.body.pass, req.body.email, function(result) {

        if (result) {
            console.log(result);
            res.send(409);
        } else {
            console.log('added successfully');
            res.send(200);
        };

    });
});



app.get('/graph', function(req, res) {

    databaseconnection.createCollection('publicgraphs', function(err, collection) {

        var g;
        
        collection.findOne({
            graphid: req.query.graphid
        }, function(err, items) {
            g = items;
            if (req.session.user) {
                res.render('graph', {
                    title: 'Seeder',
                    graphid: req.graphid,
                    username: req.session.user.name.givenName,
                    signouttext: "Sign Out",
                    gdata: g,
                    signlink: '/logout'
                });
            } else {
                res.render('graph', {
                    title: 'Seeder',
                    graphid: req.graphid,
                    username: "Sign In",
                    signouttext: "Sign In",
                    gdata: g,
                    signlink: '/login'
                });
            }
        });

    });


});

app.get('/build', function(req, res) {

    if (req.session.user) {
        console.log(JSON.stringify(req.session) + ' user found');

        var c = new Object();

        c.id = req.session.user.id;
        c.displayName = req.session.user.name.displayName;
        

        res.cookie('seederuserID', JSON.stringify(c), {
            maxAge: 3600000,
            path: '/build',
            secret: 'supersecret'
        });
        //render with user details
        res.render('index', {
            title: 'Seeder',
            username: req.session.user.name.givenName,
            signlink: '/logout',
            signouttext: 'Sign Out'
        });
    } else {
        console.log('no user logged in');
        res.redirect('/login');
    }




});

app.get('/logout', function(req, res) {

    req.session = null;
    //req.logout();
    res.clearCookie('seederuser', {
        path: '/'
    });
    res.clearCookie('seeder.sess', {
        path: '/'
    });
    res.redirect('/');
});


//app.get('/users', user.list);

app.get('/blog', function(req, res) {

    if (req.session.user) {
        res.render('blog', {
            logintext: req.session.user.name.givenName,
            signouttext: "Sign Out",
            signlink: '/logout'
        });
    } else {
        res.render('blog', {
            logintext: "Sign In",
            signouttext: "Sign In",
            signlink: '/login'
        });
    }


});

app.get('/explore', function(req, res) {




    var exploredata = seedling.getPublic('all', function(dta) {
        //socket.emit('EXPLORE_SERVE_RESPONSE', {payload: dta});
        //console.log('got ' + dta);


        if (req.session.user) {
            res.render('explore', {
                title: 'Explore',
                graphs: dta,
                len: dta.length,
                logintext: req.session.user.name.givenName,
                signouttext: "Sign Out",
                signlink: 'logout'

            });

        } else {

        }

        res.render('explore', {
            title: 'Explore',
            graphs: dta,
            len: dta.length,
            logintext: "Sign In",
            signouttext: "Sign In",
            signlink: '/login'
        });

    });




});

//server side socket connection reciever
io.sockets.on('connection', function(socket) {

    function respondurl(url_res) {

    }


    socket.on('USER_SAVEGRAPH', function(data) {
        //console.log('server : user with id' + data.payload.graphname + ' requested graph save');
        if (data.payload.publish) {
            //console.log(JSON.stringify(UserBase));
            //data.payload.authorname = UserBase[data.payload.author].displayName;
            console.log('user display name is ' + JSON.stringify(data));
            var url = seedling.db_push_graph(data.payload, true);
            socket.emit('PUBLISH_SUCCESS', {
                payload: url
            });


        } else {
            //db_push_graph(data.payload, false);
            socket.emit('SAVE_SUCCESS', {
                payload: seedling.db_push_graph(data.payload, false)
            });
        }
    });

    //SERVE_EXPLORE_HOMEPAGE

    socket.on('SERVE_EXPLORE_HOMEPAGE', function(data) {
        //console.log('server : user with id' + data.payload.graphname + ' requested graph save');
        //get public graphs and serve back to client
        //database


    });


});

