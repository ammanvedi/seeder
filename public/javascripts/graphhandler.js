$(document).ready(function () {


  var test_nodes = 20;

    //create a socket to connect to the server
    //this net
    var socket = io.connect('http://localhost:3000');

    //sigma.js preferences/options
    var sigRoot = document.getElementById('graph_canvas');
    var sigInst = sigma.init(sigRoot).drawingProperties({
        defaultLabelColor: '#000',
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
    sigInst.bind('overnodes', showInfo).activateFishEye().draw();

    // 2.4278765515909404

    // 0.2625419675446003

    //actual
    //2.465708068894392
    //0.38719854739982723

    //initial jquery ui settings
    $('#graph_canvas').backgroundDraggable({ bound: false})
    $("#tabs").tabs();
    $("input[type=submit]").button();
    $("#pallete").draggable({
        containment: "parent"
    });
    $('#graph_tab').height($("body").height());
    $('#text_tab').height(0);
    $('.menu-link').bigSlide();

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

    var label_threshold = 50;


    //for generating debug graphs, retrieve a random hex color code
    function get_random_color() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }

    //debug node set, generates 50 random nodes for testing purposes
    for (var l = 0; l < test_nodes; l++) {
      if(test_nodes == 1){

        addNode(0, 0, 5, 'tst node #' + l, ("tst node #" + l).substring(0, 17), get_random_color());
      }else{
        addNode(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20), 5, 'node ' + l, ("this is node " + l).substring(0, 17), get_random_color());
      }
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
        sigInst.draw();
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

        if (attr == undefined) {

            attr = [{
                    name: 'URL',
                    val: 'None'
                }, {
                    name: 'DESCRIPTION',
                    val: 'None'
                }, {
                    name: 'TITLE',
                    val: 'None'
                }, {
                    name: 'IMAGE',
                    val: 'None'
                }, {
                    name: 'TYPE',
                    val: 'Text'
                }, {
                    name: 'DOMAIN',
                    val: 'None'
                }

            ];

        }

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
        sigInst.addNode(id, {
            label: n,
            color: c,
            size: s,
            x: x,
            y: y,
            attr: attr
        });

        //redraw the graph after node addition
        drawGraph();

    }

    //function called when the mouse is over a node
    function showInfo(event) {

      $('#node_detail_pane').remove();

        var node;
        sigInst.iterNodes(function (n) {
            node = n;
        }, [event.content[0]]);
        //save this node as the last node hovered over
        last_node = node;

        //show details in div
        console.log('ADDING');
        jQuery('<div/>', {
            id: 'node_detail_pane',
            html: '<p>' + node['attr']['attr'][0]['name'] + ' : ' + node['attr']['attr'][0]['val'] + '<br/>' +
                node['attr']['attr'][1]['name'] + ' : ' + node['attr']['attr'][1]['val'] + '<br/>' +
                node['attr']['attr'][2]['name'] + ' : ' + node['attr']['attr'][2]['val'] + '<br/>' +
                node['attr']['attr'][4]['name'] + ' : ' + node['attr']['attr'][4]['val'] + '<br/>' +
                node['attr']['attr'][5]['name'] + ' : ' + node['attr']['attr'][5]['val'] + '<br/></p>'

        }).appendTo('#node_information_holder');

        if (node['attr']['attr'][3]['val'] != 'None') {
            jQuery('<img/>', {
                src: node['attr']['attr'][3]['val'],
                id: 'detail_image',
                width: 80,
                height: 80
            }).appendTo('#node_detail_pane');
        }

  console.log(node['attr']['attr'][3]['val']);


    }



    $('#btn_show_graph').click(function () {
        $('#text_tab').height(0);
        $('#graph_tab').height($("body").height());
        drawGraph();
    });

    $('#btn_addedge').click(function () {

        if (making_edge) {

            for (var l = 0; l < edge_path.length - 1; l++) {
                sigInst.addEdge(edge_path[l].id + edge_path[l + 1].id, edge_path[l].id, edge_path[l + 1].id);
            }

            drawGraph();
            edge_path = new Array();
            making_edge = false;

        } else {
            making_edge = true;
        }

    });

    $('#btn_show_text').click(function () {
        $('#text_tab').height(100);
        $('#graph_tab').height(0);
    });

    $('#graph_canvas').mousemove(function (a) {

        if (showing_details) {

            // var diff_y =  Math.abs(parseInt($('#node_detail_pane').css("top")) - parseInt(a.clientY));
            // var diff_x = Math.abs(parseInt($('#node_detail_pane').css("left")) - parseInt(a.clientX));
            // var ratio = ((sigInst.getNodes('reference').x - sigInst.getNodes('origin').x) / (sigInst.getNodes('reference').displayX - sigInst.getNodes('origin').displayX));

            //         if((diff_x > (label_threshold + (0.5/ratio)) || diff_y > (label_threshold+ (0.5/ratio))) ){
            //           console.log('rmv');
            //            $('#node_detail_pane').remove();
            //            showing_details = false;
            //         }

        };
    });

    $('#graph_canvas').click(function (evnt) {

      var graph_left_margin = parseInt($('#graph_canvas').css("margin-left"));
      console.log('LOLLLLO ' + parseInt(graph_left_margin));
      var graph_top_margin = parseInt($('#graph_canvas').css("margin-top"));

      var navbar = parseInt($('#navbar').height());

      console.log('clickat x: ' + evnt.offsetX + ' y : ' + evnt.offsetY);
      console.log(evnt);

        //calculating the sigmajs cartesian co-ordinates canvas co-ords
        var ratio_display_x = ((sigInst.getNodes('reference').x - sigInst.getNodes('origin').x) / (sigInst.getNodes('reference').displayX - sigInst.getNodes('origin').displayX));
        var ratio_display_y = ((sigInst.getNodes('reference').y - sigInst.getNodes('origin').y) / (sigInst.getNodes('reference').displayY - sigInst.getNodes('origin').displayY));
        var out_x = (evnt.offsetX  - sigInst.getNodes('origin').displayX) * ratio_display_x;
        var out_y = (evnt.offsetY  - sigInst.getNodes('origin').displayY) * ratio_display_y;

        $('#field_node_xpos').val(out_x);
        $('#field_node_ypos').val(out_y);
    });

    $('#btn_savegraph').click(function () {

        var nd = new Array();
        var ed = new Array();

        var n = sigInst.iterNodes(function (nds) {
            nd.push(nds.id);
        });
        var e = sigInst.iterEdges(function (egs) {
            ed.push(egs.id);
        });

        var to_send_nodes = {
            nodes: sigInst.getNodes(nd)
        };
        var to_send_edges = {
            edges: sigInst.getNodes(ed)
        };

        //console.log(socket);
        console.log('client socket ' + socket.id + ' sending ' + to_send_nodes + ' ' + to_send_edges + ' to server');
        //console.log(to_send_nodes)
        //console.log(to_send_edges)

        socket.emit('savegraph_nodes', to_send_nodes);
        socket.emit('savegraph_edges', to_send_edges);


    });

    $('#btn_addnode').click(function () {

        var xpos = $('#field_node_xpos').val();
        var ypos = $('#field_node_ypos').val();
        var size = $('#field_node_size').val();
        var node_id = $('#field_node_id').val();
        var node_name = $('#field_node_name').val();
        var node_color = $('#picker_edgecolor').val();



        //node attributes for debugging
        var attribs = [{
                name: 'URL',
                val: 'None'
            }, {
                name: 'DESCRIPTION',
                val: 'None'
            }, {
                name: 'TITLE',
                val: node_name
            }, {
                name: 'IMAGE',
                val: 'None'
            }, {
                name: 'TYPE',
                val: 'Text'
            }, {
                name: 'DOMAIN',
                val: 'None'
            }

        ];

        console.log('adding at ' + xpos + ' y: ' + ypos);


        addNode(xpos, ypos, size, node_id, node_name, node_color, attribs);
        //$('#text_tab').html(listNodes(nodes));
        drawGraph();
        var nd = sigInst.getNodes(node_id);
        //sigInst.goTo(nd['displayX'], nd['displayY'], 2);

    });

    var is_adding_article = false;
    var attribs_article;

    document.body.addEventListener("mousedown", function (evt) {

      console.log(evt);


        if ((evt.target.className == 'search_result') || (evt.target.parentElement.className == 'search_result')) {

            is_adding_article = true;
            console.log('article clicked');
            console.log(evt);


            //build attributes to be passed to the node on creation

            if((evt.target.className == 'search_result')){


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

            }else{

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



            jQuery('<div/>', {
                id: 'article_dropper'
            }).appendTo('body');

            $('#article_dropper').css({
                left: evt.pageX,
                top: evt.pageY
            });

        } else {
            is_adding_article = false;
        }

    }, false);

    document.body.addEventListener("mousemove", function (evt) {

        if (is_adding_article) {

            //console.log('drag to add article began');

            $('#article_dropper').css({
                left: evt.pageX + 10,
                top: evt.pageY + 10
            });
        }

    });

    document.body.addEventListener("mouseup", function () {

        if (is_adding_article) {
            is_adding_article = false;
        }

    });

    $('#graph_canvas').mouseup(function (evt) {


        if (is_adding_article) {

            $('#article_dropper').remove();
            //console.log($('#menu').width() + ' ');
            is_adding_article = false;
            //calculating the sigmajs cartesian co-ordinates canvas co-ords
            var ratio_display_x = ((sigInst.getNodes('reference').x - sigInst.getNodes('origin').x) / (sigInst.getNodes('reference').displayX - sigInst.getNodes('origin').displayX));
            var ratio_display_y = ((sigInst.getNodes('reference').y - sigInst.getNodes('origin').y) / (sigInst.getNodes('reference').displayY - sigInst.getNodes('origin').displayY));
            var out_x = ((evt.offsetX) - sigInst.getNodes('origin').displayX) * ratio_display_x;
            var out_y = ((evt.offsetY) - sigInst.getNodes('origin').displayY) * ratio_display_y;
            //console.log('lol x: ' + out_x + ' lol y : ' + out_y + ' nb: ' + $('#navbar').height());
            addNode(parseFloat(out_x.toString().substring(0, 4)), parseFloat(out_y.toString().substring(0, 4)), 5, get_random_color(), attribs_article[2].val, get_random_color(), attribs_article);

        }

    });

    mouseRoot.addEventListener('click', function (evt) {

        var mousePos = getMousePos(mouseRoot, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;

        if (making_edge) {
            edge_path.push(last_node);
            //console.log('edge spans');
            //console.log(edge_path);
            overnode = false;
        };

    }, false);

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