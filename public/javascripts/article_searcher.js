/*http://api.embed.ly/1/extract?
						key=:key
						&url=:url
						&maxwidth=:maxwidth
						&maxheight=:maxheight
						&format=:format
						&callback=:callback

*/


$(document).ready(function() {



function search(url){

}

function buildURLs(searchterm){
	
}


$('#btn_searcharticles').click(function(){

    console.log($('#input_searcharticles').val());

    $.embedly.extract('http://embed.ly', {key: '365526c2e08d4ee5975adbb471147713'}).progress(function(data){
  alert(data.title);
});


});




});

