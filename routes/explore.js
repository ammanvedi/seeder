exports.explore = function(req, res){


var exploredata = getPublic('all', function (dta){
	//socket.emit('EXPLORE_SERVE_RESPONSE', {payload: dta});
	console.log('got ' + dta);
});


  res.render('explore', { title: 'Explore' });
};