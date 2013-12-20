/*http://api.embed.ly/1/extract?
						key=:key
						&url=:url
						&maxwidth=:maxwidth
						&maxheight=:maxheight
						&format=:format
						&callback=:callback

*/


$(document).ready(function() {


$('#search_results_holder').height(0);



function search(trm){
$('#search_results_holder').height(300);


	var json_dta = httpGet('https://www.googleapis.com/customsearch/v1?key=AIzaSyDM8_gZ-5DQVcBUt1y7qq_wAjUDbr4YSTA&cx=009521426283403904660:drg6vvs6o2a&q=' + trm);
var json_objects = jQuery.parseJSON( json_dta ).items;

//console.log(json_objects);

json_objects.forEach(function(itm){
	console.log(itm.title);
	console.log(itm.snippet);
	console.log(itm.formattedUrl)
	console.log('\n');


jQuery('<div/>', {
	    class: 'search_result',
    html: itm.title + '<br/><br/>' + itm.snippet + '<br/><br/>' + '<a href=\'http://' + itm.formattedUrl + '\'>view story</a>' +  '<br/><br/>'
}).appendTo('#search_results_holder');



});





}

function buildURLs(searchterm){

}

//search id : 009521426283403904660:drg6vvs6o2a

// api key : AIzaSyDM8_gZ-5DQVcBUt1y7qq_wAjUDbr4YSTA

//base api : https://www.googleapis.com/customsearch/v1?key=AIzaSyDM8_gZ-5DQVcBUt1y7qq_wAjUDbr4YSTA&cx=009521426283403904660:drg6vvs6o2a&q=

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}





$('#btn_searcharticles').click(function(){

  
    search($('#input_searcharticles').val())

});



});





