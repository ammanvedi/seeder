$(document).ready(function() {

/**
 * generate a random hex color string (#123ABC)
 * @return {String} The randomly generated hex color reference
 */
function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}
/*!
*
*/

var bgcount = 0;

var bgArr = ["img/slide/air.jpg", "img/slide/desk.jpg", "img/slide/bush.png"]; //and so on...
var loaded = new Array();

function load_ss(urls){

var i;



	for(i = 0 ; i < urls.length; i++){
		var im = new Image();
		im.src = urls[i];
		loaded.push(im);
	}
	
	
}


function backgroundSlide(i) {
if ((i == bgArr.length) || (i  < 0)){
	return true;
	}
	console.log(loaded[i].src);
    $("#explore-banner").css("background-image", 'url('+loaded[i].src+')');

}

load_ss(bgArr);

setInterval(movebg, 3000);

function movebg(){
	if(backgroundSlide(bgcount++)){
		bgcount = 0;
	};
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return 'rgba('+parseInt(result[1], 16)+', '+parseInt(result[2], 16)+', '+parseInt(result[3], 16)+', 0.3)';
}

var  MainSidebarExplore = $('.ui.sidebar');

//MainSidebarExplore.sidebar('toggle');
MainSidebarExplore.sidebar('attach events','#sidebar-toggle' , 'toggle');


var t = new Trianglify({
    x_gradient: colorbrewer.YlGnBu[9], 
    y_gradient: colorbrewer.RdPu[9],
    noiseIntensity: 0.1, 
    cellpadding: Math.random()*10, 
    cellsize: Math.random()*150});

$('.circholder').each(function (){


	
	var pattern = t.generate($(this).outerWidth(), $(this).outerHeight());
	//document.body.setAttribute('style', 'background-image: '+pattern.dataUrl);
	$(this).css('background-image',pattern.dataUrl);
});



});