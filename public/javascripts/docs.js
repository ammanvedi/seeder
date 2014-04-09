$(document).ready( function() {

	$.getJSON("https://api.github.com/repos/ammanvedi/seeder/commits", function (commits){
		console.log(commits[0]);
		//.commit.author.name
		//.commit.author.date
		//.commit.message
		//.commit.url
		//repo.open_issues
		//
		var d = new Date(Date.parse(commits[0].commit.author.date));
		console.log('last commit on ' + d.toDateString() + '<br/> by ' + commits[0].commit.author.name);
		
	
		console.log(commits[0]);
		
		$('#commitheader').text('last commit on ' + d.toDateString() + ' by ' + commits[0].commit.author.name);
		if(commits[0].commit.message.length < 70){
		$('#commitmessage').text('"'+commits[0].commit.message+'"');
		}
		else if(commits[0].commit.message.length > 70){
		$('#commitmessage').text('"'+commits[0].commit.message.substring(0,70)+'..."');
		}
				
		$('#commitlink').attr('target', '_blank');
		$('#commitlink').attr('href', commits[0].html_url);
	});
});