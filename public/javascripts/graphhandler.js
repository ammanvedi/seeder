var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem

    var that = {
      init:function(system){
        //
        // the particle system will call the init function once, right before the
        // first frame is to be drawn. it's a good place to set up the canvas and
        // to pass the canvas size to the particle system
        //
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system

        // inform the system of the screen dimensions so it can map coords for us.
        // if the canvas is ever resized, screenSize should be called again with
        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
        // set up some event handlers to allow for node-dragging
        that.initMouseHandling()
      },
      
      redraw:function(){
        // 
        // redraw will be called repeatedly during the run whenever the node positions
        // change. the new positions for the nodes can be accessed by looking at the
        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
        // of the particle system rather than the screen. you can either map them to
        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
        // which allow you to step through the actual node objects but also pass an
        // x,y point in the screen's coordinate system
        // 
        ctx.fillStyle = "white"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(0,0,0, .333)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        })

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords

          // draw a rectangle centered at pt
          var w = 10
          //ctx.fillStyle =  "orange";
          //ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)
         
        //

              var radius = 10;

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#003300';
      ctx.stroke();

        ctx.font = '12pt Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(node.name, pt.x-4, pt.y+3);

        })              
      },
      
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // start listening
        $(canvas).mousedown(handler.clicked);

      },
      
    }
    return that
  }    


$(document).ready(function () {

    var adding = false;


    var sys = arbor.ParticleSystem(1000, 2000, 1.0) // create the system with sensible repulsion/stiffness/friction
    sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
    sys.renderer = Renderer("#graph_canvas") // our newly created renderer will have its .init() method called shortly by sys...

    // add some nodes to the graph and watch it go...
    sys.addEdge('a','b');
    sys.addEdge('a','c');
    sys.addEdge('a','d');
    sys.addEdge('a','e');

    var ct = 0;

    $('#graph_canvas').click(function (a) {

      console.log('heyy');
      var nearme = sys.nearest({x:a.pageX, y:a.pageY});
      console.log(nearme);
      sys.addEdge(nearme.node.name, ct+'');
      ct++;
    });

    $('body').mousedown(function (e){
        console.log(e);
        if(e.srcElement.className == 'result_adder')
        {
            adding = true;
            console.log('adder clicked');
        }
    });
    var menuwidth = $('#menu').width();
    var navheight = $('#nav').height();


    $('body').mouseup(function (e){
        if(adding){
            adding = false;
            console.log('event');
            console.log(e);
                  var nearme_ = sys.nearest({x:e.pageX - menuwidth, y:e.pageY-navheight});
                  console.log('nearest');
        console.log(nearme_);
        sys.addEdge(nearme_.node.name, ct+'');
        ct++;

        }
    });






  var test_nodes = 0;
  var DEPLOYIP = 'http://54.201.24.162'; //localhost


    //create a socket to connect to the server
    //this net
    var socket = io.connect(DEPLOYIP + ':8080');



    var showing_details = false;
    //for the edge creation function, determines if an edge is
    //currently being drawn
    var making_edge = false;
    //boolean stores weather the mouse cursor is over a node in the graph
    var overnode = false;
    //stores the last node that the mouse cursor passed over,
    //when drawing edges
    var last_node;
    //when initialising an instance of the sigma.js graph, sigma will
    //create a canvas dedicated to intercepting mouse events
    //save this for later reference
    var mouseRoot = document.getElementById('sigma_mouse_1');
    //instantiate the graph, set the delegate for 'overnode' events
    //applys fisheye plugin


    //initial jquery ui settings

    $("#tabs").tabs();
    $("input[type=submit]").button();
    $("#pallete").draggable({
        containment: "parent"
    });
    $('#graph_tab').height($("body").height());
    $('#text_tab').height(0);
    $('.menu-link').bigSlide();




    //for generating debug graphs, retrieve a random hex color code
    function get_random_color() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }




    //reference nodes, thesea re used in calculation of the cartesian
    // mouse position
    addNode(5, 5, 3, 'reference', 'reference', '#000');
    addNode(0, 0, 3, 'origin', 'origin', '#000');

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX,
            y: evt.clientY
        };
    };

    //draw the sigmajs instance
    function drawGraph() {

    }




    //when a user wants to get a graph, use the socket connection to
    //send a message to the server indicating which graph to pull
    function initiatePullGraph(gID) {
        socket.emit('request_pullGraph', {
            graphID: gID
        });
    }

    //once a graph has been pulled from the server, it is neccacary to
    //rebuild it into a valid sigma graph
    function rebuildPullGraph(pulled) {
        //TO DO
        //add all nodes and edges back to the sigmajs instance
    }

    //add a node to the graph
    function addNode(x, y, s, id, n, c, attr) {



    }

    //function called when the mouse is over a node
    function showInfo(event) {




    }



    $('#btn_show_graph').click(function () {

    });

    $('#btn_show_text').click(function () {
 
    });



    $('#btn_savegraph').click(function () {




    });

    $('#btn_addnode').click(function () {


    });


    document.body.addEventListener("mousedown", function (evt) {

   

    }, false);

    document.body.addEventListener("mousemove", function (evt) {


    });

    document.body.addEventListener("mouseup", function () {



    });


  

    socket.on('hs_id', function (data) {
        socket.id = data.data;
        console.log('client : recieved id ' + socket.id + ' from server');
    });

    socket.on('request_pullGraph_success', function (data) {
        console.log('client : pullGraph request successful, result:')
        console.log(data.data);
        rebuildPullGraph(data.data);
    });

});