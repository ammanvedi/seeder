/**
 * Note is a module written to handle the display of simple notifications to the user while they are using the seeder build interface
 * @param {String} domcontext the class name or id of the div to add the note to (eg "#container")
 * @param {Object} options {w: int, h: int, title: string, subtext: string} 
 */

function note(domcontext, opts){
	clearnotes();
	
	var w = opts.w;
	var h = opts.h;
	var title = opts.title;
	var subtext = opts.subtext;
	
	$(domcontext).prepend('<div class="note"></div>');
	$('.note').append('<div class="notetext"></div>');
	$('.notetext').append('<h1>' + title + '</h1>');
	$('.notetext').append('<p>' + subtext + '</p>');
	$('.note').append('<div id="hidenote" class="ui tiny black icon button"><i class="remove inverted icon"></i></div>');

	$('.note').css('right', '-300px');
	$('.note').css('width', w+'px');
	$('.note').css('height', h+'px');
	$(".note").animate({right:'5px'});

	
	$('#hidenote').click(function (a){
		clearnotes();
	});
}

/**
 * Clear (fadeout) the note that is being displayed currently, to make way for a new note
 */

function clearnotes(){
	//remove all notes from the dom tree
	$('.note').fadeOut( 1500 , function (){
			this.remove();
			//console.log('ehehehehe');
	});
}