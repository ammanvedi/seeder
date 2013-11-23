console.log("started handler");









$(document).ready(function() {

	var sigRoot = document.getElementById('graph_canvas');
var sigInst = sigma.init(sigRoot);


	var mouseRoot = document.getElementById('sigma_mouse_1');



function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      };


      mouseRoot.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(mouseRoot, evt);
        //var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        //console.log(message);
      }, false);


$( "#tabs" ).tabs();
$("#display_code").tabs();
//-----------------------VARIABLES

var meta = {};

//default node creation
var node = {
	posx: 100,
	posy: 100,
	size: 20,
	id: 'id',
	name: 'initial node',
}

var nodes = new Array();

nodes[0] = node;

//-----------------------FUNCTIONS



function drawGraph(){


sigInst.draw();


/*  for(i = 1; i < (N-2); i++){
      var cluster = clusters[(Math.random()*C)|0], n = cluster.nodes.length;
      sigInst.addEdge(i,allnodes[i],allnodes[i+1]);
 } */


  // Draw the graph :


}

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

	sigInst.addNode(id,{
  label: n,
  color: '#ff0000',
  size: s,
  x: x,
  y: y
});

	drawGraph();


}



//-----------------------DELEGATES

$('#text_tab').html(listNodes(nodes));

$('#btn_show_graph').click(function() {
	drawGraph();
});

$('#btn_addnode').click(function() {

      var xpos = $('#field_node_xpos').val();
      var ypos = $('#field_node_ypos').val();
      var size = $('#field_node_size').val();
      var node_id = $('#field_node_id').val();
      var node_name = $('#field_node_name').val();

      addNode(xpos,ypos,size,node_id, node_name);
      $('#text_tab').html(listNodes(nodes));
      drawGraph();

    });



});


