console.log("started handler");

var meta = {};

//default node creation
var node = {
	posx: 100,
	posy: 100,
	size: 2,
	id: 'id',
	name: '',
	meta: {},
}

$(document).ready(function() {
    $('#btn_addnode').click(function() {
      console.log($('#field_nodename').val());
    });
});

