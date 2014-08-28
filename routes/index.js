
/*
 * GET home page.
 */


exports.index = function(req, res){

if(req.user){
	res.render('home', {logintext : req.user.name.givenName, signouttext: "Sign Out", title: 'seeder.co', signlink:'/logout'});
}else{
	  res.render('home', {logintext : "Sign In", signouttext: "Sign In", title: 'seeder.co', signlink: "/login"});
}





  
};