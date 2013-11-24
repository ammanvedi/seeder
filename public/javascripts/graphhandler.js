console.log("started handler");

$(document).ready(function() {

	var sigRoot = document.getElementById('graph_canvas');
var sigInst = sigma.init(sigRoot).drawingProperties({
    defaultLabelColor: '#fff',
    defaultLabelSize: 10,
    defaultLabelBGColor: '#fff',
    defaultLabelHoverColor: '#000',
    labelThreshold: 8,
    defaultEdgeType: 'curve'
  }).graphProperties({
    minNodeSize: 0.5,
    maxNodeSize: 20,
    minEdgeSize: 1,
    maxEdgeSize: 3
  }).mouseProperties({
    maxRatio: 10
  });

  	var making_edge = false;
  	var overnode = false;
  	var last_node;
	var mouseRoot = document.getElementById('sigma_mouse_1');
	sigInst.bind('overnodes',showInfo).activateFishEye().draw();








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
var edge_path = new Array();


//-----------------------FUNCTIONS


//debug node set

addNode(0.1,0.1,3,'a','node a', '#300000');
addNode(0.2,0.2,3,'b','node b', '#300000');
addNode(0.3,0.3,3,'c','node c', '#300000');


function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX,
          y: evt.clientY
        };
      };



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



function addNode(x, y, s, id, n, c){
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
  color: c,
  size: s,
  x: x,
  y: y
});

	//console.log('nodes');
	//§console.log(nodes);

	drawGraph();


}

function showInfo(event){
  var node;
      sigInst.iterNodes(function(n){
        node = n;
      },[event.content[0]]);
      last_node = node;

}





//-----------------------DELEGATES

$('#text_tab').html(listNodes(nodes));

$('#btn_show_graph').click(function() {
	drawGraph();
});

$('#btn_addedge').click(function() {

if(making_edge){

	for(var l = 0; l < edge_path.length-1; l++){
		sigInst.addEdge(edge_path[l].id + edge_path[l+1].id,edge_path[l].id,edge_path[l+1].id);
	}

	

	//process edge path
	drawGraph();
	edge_path = new Array();
	making_edge = false;

}else{
	making_edge = true;
}

	});

$('#btn_addnode').click(function() {

      var xpos = $('#field_node_xpos').val();
      var ypos = $('#field_node_ypos').val();
      var size = $('#field_node_size').val();
      var node_id = $('#field_node_id').val();
      var node_name = $('#field_node_name').val();
      var node_color = $('#picker_edgecolor').val();

      addNode(xpos,ypos,size,node_id, node_name, node_color);
      $('#text_tab').html(listNodes(nodes));
      drawGraph();

    });

//-----------------------PERSISTANT LISTENERS

mouseRoot.addEventListener('mousemove', function(evt) {



	});

      mouseRoot.addEventListener('click', function(evt) {
        var mousePos = getMousePos(mouseRoot, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        //console.log(message);

        if (making_edge) {

        	
        	edge_path.push(last_node);
        	console.log('edge spans');
        	console.log(edge_path);

        	//making_edge = false;
        	overnode = false;
        };


      }, false);

});


