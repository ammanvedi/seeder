$(document).ready(function() {

var words = new Array();

words[0] = 'mindmap.';
words[1] = 'reference.';
words[2] = 'learn.';
words[3] = 'collaborate.';

var count = 1;

function updatetext(){
	$("#shuffleme").shuffleText(words[count%words.length], {
	    frames : 30,
	    maxSpeed : 500,
	    amount : 4,
	    complete : function(){
	        // Do something
	    }});
	count++;

}

setInterval(function(){updatetext();},5000);


console.log('loloool');



});