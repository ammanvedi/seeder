
 /*

 /$$$$$$$                            /$$                                       
| $$__  $$                          | $$                                       
| $$  \ $$  /$$$$$$  /$$$$$$$   /$$$$$$$  /$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$ 
| $$$$$$$/ /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$ /$$__  $$/$$__  $$ /$$__  $$
| $$__  $$| $$$$$$$$| $$  \ $$| $$  | $$| $$$$$$$$| $$  \__/ $$$$$$$$| $$  \__/
| $$  \ $$| $$_____/| $$  | $$| $$  | $$| $$_____/| $$     | $$_____/| $$      
| $$  | $$|  $$$$$$$| $$  | $$|  $$$$$$$|  $$$$$$$| $$     |  $$$$$$$| $$      
|__/  |__/ \_______/|__/  |__/ \_______/ \_______/|__/      \_______/|__/                                                                       
*/                                                                        


var Renderer = function (canvas) {
    var canvas = $(canvas).get(0);
    var ctx = canvas.getContext("2d");
    var particleSystem;

    var that = {
        init: function (system) {
            //
            // the particle system will call the init function once, right before the
            // first frame is to be drawn. it's a good place to set up the canvas and
            // to pass the canvas size to the particle system
            //
            // save a reference to the particle system for use in the .redraw() loop
            particleSystem = system;

            // inform the system of the screen dimensions so it can map coords for us.
            // if the canvas is ever resized, screenSize should be called again with
            // the new dimensions
            particleSystem.screenSize(canvas.width, canvas.height);
            particleSystem.screenPadding(80); // leave an extra 80px of whitespace per side

            // set up some event handlers to allow for node-dragging
            that.initMouseHandling();
        },

        redraw: function () {
            // 
            // redraw will be called repeatedly during the run whenever the node positions
            // change. the new positions for the nodes can be accessed by looking at the
            // .p attribute of a given node. however the p.x & p.y values are in the coordinates
            // of the particle system rather than the screen. you can either map them to
            // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
            // which allow you to step through the actual node objects but also pass an
            // x,y point in the screen's coordinate system
            // 
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particleSystem.eachEdge(function (edge, pt1, pt2) {
                // edge: {source:Node, target:Node, length:#, data:{}}
                // pt1:  {x:#, y:#}  source position in screen coords
                // pt2:  {x:#, y:#}  target position in screen coords

                // draw a line from pt1 to pt2
                ctx.strokeStyle = "rgba(0,0,0, .333)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(pt1.x, pt1.y);
                ctx.lineTo(pt2.x, pt2.y);
                ctx.stroke();
            })

            particleSystem.eachNode(function (node, pt) {
                // node: {mass:#, p:{x,y}, name:"", data:{}}
                // pt:   {x:#, y:#}  node position in screen coords

                // draw a rectangle centered at pt
                var w = 10
                var imagesize = 70;
                var radius = imagesize / 2;
                var radius_imageless = 10;
                //ctx.fillStyle =  "orange";
                //ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)

                //

                if (node.data.length > 0) {
                    //draw a data rich node

                    if (node.data['imagedata'] != undefined) {

                        
                        node.data['imagedata'].width = imagesize + 'px';
                        node.data['imagedata'].height = imagesize + 'px';

                        //draw the image clip arc
                        ctx.beginPath();
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI, false);
                        ctx.lineWidth = 5;
                        ctx.strokeStyle = '#003300';
                        ctx.stroke();


                        //clip the arc and draw the image, restore canvas state after
                        ctx.clip();
                        ctx.drawImage(node.data['imagedata'], pt.x - (imagesize / 2), pt.y - (imagesize / 2), imagesize, imagesize);
                        ctx.restore();

                        //draw the node title
                        ctx.font = '10pt Arial';
                        ctx.fillStyle = 'black';
                        ctx.fillText(node.data[2].val, pt.x + (imagesize / 2) + 3, pt.y + 3);

                    } else {

                        

                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, radius_imageless, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'green';
                        ctx.fill();
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = '#003300';
                        ctx.stroke();

                        ctx.font = '12pt Arial';
                        ctx.fillStyle = 'black';
                        ctx.fillText(node.data[2].val, pt.x - 4, pt.y + 3);

                    }


                } else {
                    //draw a normal node 
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
                    ctx.fillText(node.name, pt.x - 4, pt.y + 3);
                }



            });
        },

        initMouseHandling: function () {
            // no-nonsense drag and drop (thanks springy.js)
            var dragged = null;

            // set up a handler object that will initially listen for mousedowns then
            // for moves and mouseups while dragging
            var handler = {
                clicked: function (e) {
                    var pos = $(canvas).offset();
                    _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
                    dragged = particleSystem.nearest(_mouseP);

                    if (dragged && dragged.node !== null) {
                        // while we're dragging, don't let physics move the node
                        dragged.node.fixed = true;
                    }

                    $(canvas).bind('mousemove', handler.dragged);
                    $(window).bind('mouseup', handler.dropped);

                    return false
                },
                dragged: function (e) {
                    var pos = $(canvas).offset();
                    var s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);

                    if (dragged && dragged.node !== null) {
                        var p = particleSystem.fromScreen(s);
                        dragged.node.p = p;
                    }

                    return false;
                },

                dropped: function (e) {
                    if (dragged === null || dragged.node === undefined) return;
                    if (dragged.node !== null) dragged.node.fixed = false;
                    dragged.node.tempMass = 1000;
                    dragged = null;
                    $(canvas).unbind('mousemove', handler.dragged);
                    $(window).unbind('mouseup', handler.dropped);
                    _mouseP = null;
                    return false;
                }
            }

            // start listening
            $(canvas).mousedown(handler.clicked);

        },

    }
    return that;
}

/*
                               /$$             /$$    
                              |__/            | $$    
  /$$$$$$$  /$$$$$$$  /$$$$$$  /$$  /$$$$$$  /$$$$$$  
 /$$_____/ /$$_____/ /$$__  $$| $$ /$$__  $$|_  $$_/  
|  $$$$$$ | $$      | $$  \__/| $$| $$  \ $$  | $$    
 \____  $$| $$      | $$      | $$| $$  | $$  | $$ /$$
 /$$$$$$$/|  $$$$$$$| $$      | $$| $$$$$$$/  |  $$$$/
|_______/  \_______/|__/      |__/| $$____/    \___/  
                                  | $$                
                                  | $$                
                                  |__/                
  */


$(document).ready(function () {

    var DEPLOYIP = 'localhost'; //localhost
    var socket = io.connect(DEPLOYIP + ':8080');

    $("#tabs").tabs();
    $("input[type=submit]").button();

    $("#pallete").draggable({
        containment: "parent"
    });

    $('#graph_tab').height($("body").height());
    $('#text_tab').height(0);
    $('.menu-link').bigSlide();


    var adding = false;
    var menuwidth = $('#menu').width();
    var navheight = $('#nav').height();


    var sys = arbor.ParticleSystem(100, 1000, 0.3) //repulsion/stiffness/friction
    sys.parameters({
        gravity: false
    });
    sys.renderer = Renderer("#graph_canvas"); 
    
    sys.addEdge('a','e');


    var ct = 0;
    var data_to_add;


/*
                                          /$$             
                                         | $$             
  /$$$$$$  /$$    /$$/$$$$$$  /$$$$$$$  /$$$$$$   /$$$$$$$
 /$$__  $$|  $$  /$$/$$__  $$| $$__  $$|_  $$_/  /$$_____/
| $$$$$$$$ \  $$/$$/ $$$$$$$$| $$  \ $$  | $$   |  $$$$$$ 
| $$_____/  \  $$$/| $$_____/| $$  | $$  | $$ /$$\____  $$
|  $$$$$$$   \  $/ |  $$$$$$$| $$  | $$  |  $$$$//$$$$$$$/
 \_______/    \_/   \_______/|__/  |__/   \___/ |_______/ 
                                                          
*/                                                  
                                                          

    $('#graph_canvas').click(function (a) {

        /*      console.log('heyy');
      var nearme = sys.nearest({x:a.pageX, y:a.pageY});
      console.log(nearme);
      sys.addEdge(nearme.node.name, ct+'');
      ct++;*/
    });

    $('body').mousedown(function (evt) {
        console.log(evt);



        if ((evt.target.className == 'search_result') || (evt.target.parentElement.className == 'search_result')) {

            adding = true;
            console.log('article clicked');
            console.log(evt);

            //build attributes to be passed to the node on creation

            if ((evt.target.className == 'search_result')) {


                attribs_article = [{
                    name: 'URL',
                    val: evt.srcElement.attributes.URL.nodeValue
                }, {
                    name: 'DESCRIPTION',
                    val: evt.srcElement.attributes.DESCRIPTION.nodeValue
                }, {
                    name: 'TITLE',
                    val: evt.srcElement.attributes.TITLE.nodeValue
                }, {
                    name: 'IMAGE',
                    val: evt.srcElement.attributes.IMAGE.nodeValue
                }, {
                    name: 'TYPE',
                    val: evt.srcElement.attributes.TYPE.nodeValue
                }, {
                    name: 'DOMAIN',
                    val: evt.srcElement.attributes.DOMAIN.nodeValue
                }];

            } else {

                attribs_article = [{
                    name: 'URL',
                    val: evt.srcElement.parentElement.attributes.URL.nodeValue
                }, {
                    name: 'DESCRIPTION',
                    val: evt.srcElement.parentElement.attributes.DESCRIPTION.nodeValue
                }, {
                    name: 'TITLE',
                    val: evt.srcElement.parentElement.attributes.TITLE.nodeValue
                }, {
                    name: 'IMAGE',
                    val: evt.srcElement.parentElement.attributes.IMAGE.nodeValue
                }, {
                    name: 'TYPE',
                    val: evt.srcElement.parentElement.attributes.TYPE.nodeValue
                }, {
                    name: 'DOMAIN',
                    val: evt.srcElement.parentElement.attributes.DOMAIN.nodeValue
                }];

            }

            console.log(attribs_article);
            data_to_add = attribs_article;

        }
    });



    $('body').mouseup(function (e) {
        if (adding) {
            //preload the image 

            var prefetch = new Image();
            prefetch.src = data_to_add[3].val;
            data_to_add['imagedata'] = prefetch;

            adding = false;
            console.log('event');
            console.log(e);

            var len = 0;

            sys.eachNode(function (node, pt){
              len++;
            });



           
              console.log('loldsdlsld 33');

            var nearme_ = sys.nearest({
                x: e.pageX - menuwidth,
                y: e.pageY - navheight
            });

            sys.addNode(ct + '', data_to_add);
            sys.addEdge(nearme_.node.name, ct + '');
            


 
            ct++;



        }
    });

/*
                               /$$                   /$$             
                              | $$                  | $$             
  /$$$$$$$  /$$$$$$   /$$$$$$$| $$   /$$  /$$$$$$  /$$$$$$   /$$$$$$$
 /$$_____/ /$$__  $$ /$$_____/| $$  /$$/ /$$__  $$|_  $$_/  /$$_____/
|  $$$$$$ | $$  \ $$| $$      | $$$$$$/ | $$$$$$$$  | $$   |  $$$$$$ 
 \____  $$| $$  | $$| $$      | $$_  $$ | $$_____/  | $$ /$$\____  $$
 /$$$$$$$/|  $$$$$$/|  $$$$$$$| $$ \  $$|  $$$$$$$  |  $$$$//$$$$$$$/
|_______/  \______/  \_______/|__/  \__/ \_______/   \___/ |_______/ 
                                                                                                                                          
*/                                                                

    socket.on('hs_id', function (data) {
        socket.id = data.data;
        console.log('client : recieved id ' + socket.id + ' from server');
    });

    socket.on('request_pullGraph_success', function (data) {
        console.log('client : pullGraph request successful, result:')
        console.log(data.data);
        rebuildPullGraph(data.data);
    });


    //for generating debug graphs, retrieve a random hex color code
    function get_random_color() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }


    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX,
            y: evt.clientY
        };
    };


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

    $('#btn_savegraph').click(function () {

    });

    $('#btn_addnode').click(function () {

    });


});