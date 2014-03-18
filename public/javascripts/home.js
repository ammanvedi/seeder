

$(document).ready(function() {



var  MainSidebarExplore = $('.ui.sidebar');

//MainSidebarExplore.sidebar('toggle');
MainSidebarExplore.sidebar('attach events','#sidebar-toggle' , 'toggle');

$('.shape').shape()

var words = new Array();

words[0] = 'mindmap.';
words[1] = 'reference.';
words[2] = 'learn.';
words[3] = 'collaborate.';

var count = 1;

function updatetext(){
	$("#shuffleme").shuffleText(words[count%words.length], {
	    frames : 20,
	    maxSpeed : 10000,
	    amount : 2,
	    complete : function(){
	        // Do something
	    }});
	count++;
	
	console.log($('.shape').shape('flip down'));

}

setInterval(function(){updatetext();},5000);


console.log('loloool');



});



