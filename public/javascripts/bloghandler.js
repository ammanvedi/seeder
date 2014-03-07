$(document).ready(function() {


var postheight = 200;
 $('#btn_readmore').click(function (evt) {
	console.log(evt);
	var el = $(evt.srcElement.previousElementSibling);
	if(el.height() > postheight){
		el.css('height', postheight+'px');
		$(evt.srcElement.childNodes[0]).removeClass('rotatedplus');

	}else{
		el.css('height', '100%');
		$(evt.srcElement.childNodes[0]).addClass('rotatedplus');

	}
	
	
 });
 

});