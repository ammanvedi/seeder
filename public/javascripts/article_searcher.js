/*http://api.embed.ly/1/extract?
						key=:key
						&url=:url
						&maxwidth=:maxwidth
						&maxheight=:maxheight
						&format=:format
						&callback=:callback

*/


$(document).ready(function() {

		//hide the container of the search results
		//its not needed when no results are being shown
		$('#search_results_holder').height(0);
		//this function is passed the searchterm 
		function search(trm){
		//re-extend the search results holder, to show the results to the user
		$('#search_results_holder').height(300);
		//use the httpget function to grab the custom google search
		//JSON DATA
		var json_dta = httpGet('https://www.googleapis.com/customsearch/v1?key=AIzaSyDM8_gZ-5DQVcBUt1y7qq_wAjUDbr4YSTA&cx=009521426283403904660:drg6vvs6o2a&q=' + trm);
		//search results are stored in the 'items' array
		var json_objects = jQuery.parseJSON( json_dta ).items;

		console.log(json_objects);

		json_objects.forEach(function(itm){

			//for each result, add a corresponding search result division to the search
			//results container

			jQuery('<div/>', {
				    class: 'search_result',
				    URL:itm.formattedUrl,
				    DESCRIPTION: itm.snippet,
				    TITLE: itm.title,
				    IMAGE: itm.pagemap.cse_image[0].src,
				    TYPE: 'article',
				    DOMAIN: itm.displayLink,
			    	html: '<img src="' + itm.pagemap.cse_image[0].src + '"/>' + '<h1>' + itm.title + '</h1>' 
					    	+ '<p>' + itm.snippet + '</p>'
					    	
					    	+ '<a href=\'http://' 
					    	+ itm.formattedUrl 
					    	+ '\'>view story</a>' 
					    	

			}).appendTo('#search_results_holder');
			});
		}


		function httpGet(theUrl)
		{
		    var xmlHttp = null;
		    xmlHttp = new XMLHttpRequest();
		    xmlHttp.open( "GET", theUrl, false );
		    xmlHttp.send( null );
		    return xmlHttp.responseText;
		}

		//on click of the search button, take the input in the text
		//field and pass it to the search function
		$('#btn_searcharticles').click(function(){
		    search($('#input_searcharticles').val())
		});

});





