
//embedly api key 365526c2e08d4ee5975adbb471147713

console.log("started handler");

$(document).ready(function() {




  document.ontouchmove = function(event){
    event.preventDefault();
}

document.ontouchstart = function(event){
  event.preventDefault();
}

//create a socket to connect to the server
var socket = io.connect('http://localhost:3000');


//sigma.js preferences
var sigRoot = document.getElementById('graph_canvas');
var sigInst = sigma.init(sigRoot).drawingProperties({
    defaultLabelColor: '#fff',
    defaultLabelSize: 10,
    defaultLabelBGColor: '#fff',
    defaultLabelHoverColor: '#000',
    labelThreshold: 20,
    defaultEdgeType: 'curve'
  }).graphProperties({
    minNodeSize: 0.5,
    maxNodeSize: 20,
    minEdgeSize: 1,
    maxEdgeSize: 3
  }).mouseProperties({
    maxRatio: 5,
    minRatio: 1
  });

var making_edge = false;
var overnode = false;
var last_node;
var mouseRoot = document.getElementById('sigma_mouse_1');

//instantiate the graph
sigInst.bind('overnodes',showInfo).activateFishEye().draw();


//initial jquery ui settings
$( "#tabs" ).tabs();
$("input[type=submit]").button();
$("#pallete").draggable({containment: "parent"});
//expand the graph tab initally
$('#graph_tab').height($("body").height());
//hide the text tab initially
$('#text_tab').height(0);
$('.menu-link').bigSlide();
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

//additional arrays to hold the nodes and edges
var nodes = new Array();
var edge_path = new Array();


//-----------------------FUNCTIONS

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}


//debug node set, generates 50 random nodes for testing purposes

for(var l = 0; l<50; l++){
  addNode(Math.floor(Math.random()*20), Math.floor(Math.random()*20), 5,'node ' + l, ("this is node " + l).substring(0,17), get_random_color());
}


//reference nodes, thesea re used in calculation of the cartesian 
// mouse position
addNode(5,5,3, 'reference', 'reference', '#ffffff');
addNode(0,0,3, 'origin', 'origin', '#ffffff');

/*
addNode(0.1,0.1,3,'a','node a', '#300000');
addNode(0.2,0.2,3,'b','node b', '#300000');
addNode(0.3,0.3,3,'c','node c', '#300000');*/


function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX,
          y: evt.clientY
        };
      };



function drawGraph(){ sigInst.draw();}

//parse a node into a human readable form
function showNode(n){
	return '-   id: ' + n['id'] + ' name: ' + n['name'] + ' x: ' + n['posx'] + ' y: ' + n['posy'];
}

//list the nodes data 
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

function initiatePullGraph(gID){
  socket.emit('request_pullGraph', {graphID: gID});
}

function rebuildPullGraph(pulled){
  //TO DO
}

//add a node to the graph
function addNode(x, y, s, id, n, c){

//attributes for debugging
  var attribs = [
    {name: 'link', val:'http://www.google.com/'},
    {name: 'description', val:'this is the description of the node'}

]

//node to push to additional node array
	var newnode = {
	posx: x,
	posy: y,
	size: s,
	id: id,
	name: n,
	}

	nodes.push(newnode);
  //add node to the graph instance
	sigInst.addNode(id,{
  label: n,
  color: c,
  size: s,
  x: x,
  y: y,
  attr: attribs
});

	drawGraph();

}

//function called when the mouse is over a node
function showInfo(event){
  var node;
      sigInst.iterNodes(function(n){
        node = n;
      },[event.content[0]]);
      last_node = node;
      console.log(node['attr']['attr'][0]['name'] + ' : ' + node['attr']['attr'][0]['val']);
      console.log(node['attr']['attr'][1]['name'] + ' : ' + node['attr']['attr'][1]['val']);
      console.log('node centre xy ' + node['x'] + ' ' +  node['y']);


}





//-----------------------DELEGATES

$('#text_tab').html(listNodes(nodes));

$('#btn_show_graph').click(function() {

$('#text_tab').height(0);
$('#graph_tab').height($("body").height());
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

mouseRoot.addEventListener('mousemove', function(evt) {



  });

$('#btn_show_text').click(function() {

$('#text_tab').height(100);
$('#graph_tab').height(0);

}
);

$('#graph_canvas').click(function(evnt) {


var ratio_display_x = ((sigInst.getNodes('reference').x - sigInst.getNodes('origin').x) / (sigInst.getNodes('reference').displayX - sigInst.getNodes('origin').displayX));
var ratio_display_y = ( (sigInst.getNodes('reference').y - sigInst.getNodes('origin').y) / (sigInst.getNodes('reference').displayY - sigInst.getNodes('origin').displayY));


var out_x = (evnt.clientX - sigInst.getNodes('origin').displayX) * ratio_display_x;
var out_y = (evnt.clientY - sigInst.getNodes('origin').displayY) * ratio_display_y;


console.log('x: ' + out_x + ' y: ' + out_y);

  $('#field_node_xpos').val(out_x.toString().substring(0,4));
  $('#field_node_ypos').val(out_y.toString().substring(0,4));

}


);

$('#btn_savegraph').click(function() {

var nd = new Array();
var ed = new Array();

  var n = sigInst.iterNodes(function(nds){
        nd.push(nds.id);
  });

  var e = sigInst.iterEdges(function(egs){
        ed.push(egs.id);
  });

var to_send_nodes ={nodes: sigInst.getNodes(nd)};
var to_send_edges = {edges: sigInst.getNodes(ed)};



console.log(socket);
console.log('client socket ' + socket.id + ' sending ' + to_send_nodes + ' ' + to_send_edges + ' to server');
console.log(to_send_nodes)
console.log(to_send_edges)


socket.emit('savegraph_nodes', to_send_nodes);
socket.emit('savegraph_edges', to_send_edges);

initiatePullGraph("123");


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

      var nd = sigInst.getNodes(node_id);

      sigInst.goTo(nd['displayX'],nd['displayY'],2);

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

      //-------SOCKET HANDLERS

socket.on('hs_id', function (data) {

  socket.id = data.data;
  console.log('client : recieved id ' + socket.id + ' from server');

});

socket.on('request_pullGraph_success', function (data){
  console.log('client : pullGraph request successful, result:')
  console.log(data.data);
  rebuildPullGraph(data.data);
});

});





