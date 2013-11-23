console.log("started handler");


$(document).ready(function() {


//-----------------------VARIABLES

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



var nodes = new Array();

nodes[0] = node;

//-----------------------FUNCTIONS

function showNode(n){
	return 'NODE ---->   id: ' + n['id'] + ' x: ' + n['posx'] + ' y: ' + n['posy'];
}


function listnodes(nodes){
	var x = nodes.length;
	
	var list = '';

	if (x < 1) {return 'no nodes to list'};

	for (var i = 0; i < x; i++) {
		var nodeobj = nodes[i];
		list += showNode(nodeobj) + '<br/>'
	};

	return list;
}

//-----------------------DELEGATES

$('#display_code').html(listnodes(nodes));

$('#btn_addnode').click(function() {
      console.log($('#field_nodename').val());
    });





});

