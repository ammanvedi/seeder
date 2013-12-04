
/*
 * GET home page.
 */

 var MongoClient = require('mongodb').MongoClient;

exports.index = function(req, res){

  res.render('index', { title: 'Seeder' });


	  MongoClient.connect("mongodb://ammanvedi:poopoo12@ds057528.mongolab.com:57528/seeder-dev", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
     
  
});

};