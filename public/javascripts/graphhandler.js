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
}



var nodes = new Array();

nodes[0] = node;

//-----------------------FUNCTIONS

function showNode(n){
	return '-   id: ' + n['id'] + ' name: ' + n['name'] + ' x: ' + n['posx'] + ' y: ' + n['posy'];
}


function listNodes(nodes){
	var x = nodes.length;
	
	var list = '';

	if (x < 1) {return 'no nodes to list'};

	for (var i = 0; i < x; i++) {
		var nodeobj = nodes[i];
		list += showNode(nodeobj) + '<br/>'
	};

	return list;
}

function addNode(x, y, s, id, n){
	var newnode = {
	posx: x,
	posy: y,
	size: s,
	id: id,
	name: n,
	}

	nodes.push(newnode);


}

//-----------------------DELEGATES

$('#display_code').html(listNodes(nodes));

$('#btn_addnode').click(function() {

      var xpos = $('#field_node_xpos').val();
      var ypos = $('#field_node_ypos').val();
      var size = $('#field_node_size').val();
      var node_id = $('#field_node_id').val();
      var node_name = $('#field_node_name').val();

      addNode(xpos,ypos,size,node_id, node_name);
      $('#display_code').html(listNodes(nodes));

    });





});

