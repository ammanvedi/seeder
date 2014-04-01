

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
  
var sys;

var waiting_save_confirm = false;
var waiting_publish_confirm = false;

//this function will generate a state object of the entire graph
// so it can be saved to the database
  
function getSaveState(particlesys, gname, gdesc, publishme){

	var Edges = new Array();
	var Nodes = new Array();

	particlesys.eachNode(function (node, pt) {
		Nodes.push(node);
	});
	particlesys.eachEdge(function (edge, pt1, pt2){
		Edges.push(edge);
	});
	var userdata = JSON.parse($.cookie('seederuser'));
	var GraphMeta = new Object();
	GraphMeta.datecreated = +new Date;
	GraphMeta.likes = 0;
	GraphMeta.dislikes = 0;
	GraphMeta.views = 0;

	var Graph = new Object();
	Graph.nodes = Nodes;
	Graph.edges = Edges;
	
	var Savestate = new Object();
	Savestate.graphid = "abc2";
	Savestate.publish = publishme;
	Savestate.author = userdata.id;
	Savestate.graphname = gname;
	Savestate.graphdesc = gdesc;
	Savestate.graph = Graph;
	Savestate.graphmeta = GraphMeta;
	
	console.log(Savestate);
	
	return Savestate;

};


$(document).ready(function () {

    var DEPLOYIP = '192.168.1.96'; //localhost for dev, ip for prod
    var socket = io.connect(DEPLOYIP + ':8080');
    console.log( socket);
    var addnodemode = false;
    var addedgemode = false;
    var edgepath = new Array();

    //initial ui
    $("#tabs").tabs();
    $("input[type=submit]").button();
    $("#pallete").draggable({containment: "parent"});
    $('#graph_tab').height($("body").height());
    $('#text_tab').height(0);
    //$('.menu-link').bigSlide();
    $('#tabs-1').show();
    $('#tabs-2').hide();
    $('#tabs-3').hide();
    $('#tabs-4').hide();
    $('#updatelabel').hide();
    
    

    var MainSidebarBuild = $('.ui.sidebar');
    MainSidebarBuild.sidebar('toggle');
    MainSidebarBuild.sidebar('attach events', '#sidebar-toggle', 'toggle');


    var adding = false;
    var menuwidth = $('#menu').width();
    var navheight = $('#nav').height();
    var addnodePREFS = new Object();
    var editnodePREFS = new Object();
    var current_edit_focus;


    //def
    addnodePREFS['name'] = 'Start';
    addnodePREFS['text'] = 'lorem ipsum';
    addnodePREFS['link'] = 'http://www.google.com/';
    addnodePREFS['TYPE'] = 'NORMAL';
    addnodePREFS['size'] = 30;
    addnodePREFS['id'] = 0;
    addnodePREFS['color'] = '#564F8A';
    
    

    sys = arbor.ParticleSystem(0, 0, 1.0) //repulsion/stiffness/friction
    sys.parameters({
        gravity: true,
        friction: 1.0, 
        repulsion : 0
    });
    sys.renderer = Renderer("#graph_canvas");
	
	//console.log('here is the system in full');
	//console.log(sys);

    sys.addNode(addnodePREFS['name'], addnodePREFS);


    var nearestmouse;

    //keep a count of node id's
    var ct = 0;
    var data_to_add;
    
    
    var op = new Object();
    op.w = 300;
    op.h = 70;
    op.title = "Welcome!";
    op.subtext = "begin by adding some nodes";
    
    
    note('#contain_main', op);

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

    $('body').mousemove(function (e) {
    
    var mouse = {
        x: e.pageX - 270,
        y: e.pageY - 50
    };

        nearestmouse = sys.nearest(mouse);

        if (nearestmouse) {

            if (nearestmouse.node.data.length > 0) {
                nearestmouse.node.data[6].val = true;
                $('#node-title').text(nearestmouse.node.data[2].val);
                $('#node-domain').text(nearestmouse.node.data[5].val);
                $('#node-description').text(nearestmouse.node.data[1].val);
                $('#node-image').attr("src", nearestmouse.node.data[3].val);
                $('#node-link').attr("href", nearestmouse.node.data[0].val);
                //console.log(nearestmouse.node);
            } else {
                //console.log('id is : ' + nearestmouse.node.name);

            }

        }
        //sys.stop();
        
        
        //handle the re drawing of the node dropper div 
        
        if(addnodemode){
        
        	
        	var size = $('#field_node_size').val();
        	var col = $('#picker_edgecolor').val();
        	
        	if((size == '') || (col == '')){
        	//some properties not set render default
        	$('#node-dropper').css('top',(e.pageY - navheight)+'px').css('left',(e.pageX + menuwidth)+'px');
        	}else{
        		$('#node-dropper').css('top',(e.pageY - navheight)+'px').css('left',(e.pageX + menuwidth)+'px');
        		$('#node-dropper').css('background-color',col);
        		$('#node-dropper').css('width',(size*2)+'px');
        		$('#node-dropper').css('height',(size*2)+'px');
        		$('#node-dropper').css('border-radius',size+'px');
        	}

        }

    });



    $('#graph_canvas').click(function (a) {
    
    sys.start();
    
    var nearme = sys.nearest({
        x: a.offsetX,
        y: a.offsetY
    });
    
    //console.log(nearme);
    
		//console.log(nearme.node.name);

        if (addnodemode) {
        	

            //console.log('called1');
            var i = addnodePREFS;

            var data = jQuery.extend(true, {}, addnodePREFS);
			
			if(sys.getNode(addnodePREFS['name']) != undefined){
				//a node was found that matched the id, dont add the node
				//issue a notification to the user
				alert('node name already exists, you can edit nodes by clicking "edit nodes"');
			}else{
			
			if(nearme != null){
				sys.addNode(data['name'], addnodePREFS);
				sys.addEdge(nearme.node.name, data['name']);
				//console.log(nearme.node.name + ' ' + data['name']);
				//sys.stop();
				
						//alert the user
						var op = new Object();
						op.w = 300;
						op.h = 70;
						op.title = "Node Added!";
						op.subtext = "node named " + data['name'] + " added.";
						
						
						note('#contain_main', op);
						
						
				ct++;
				}else{
				
					sys.addNode(data['name'], addnodePREFS);
					
					//console.log('ahahahah');
					
							//alert the user
							var op = new Object();
							op.w = 300;
							op.h = 70;
							op.title = "Node Added!";
							op.subtext = "node named " + data['name'] + " added.";
							
							
							note('#contain_main', op);
				
					
						
				}
				//sys.stop();
			}
			
			$('#node-dropper').remove();
			$('#btn_addnode').removeClass('red').addClass('green');
			$('#btn_addnode').val('Add Node');
			addnodemode = false;
			
			var leng = 0;
			
			sys.eachNode(function (node, pt) {
			    //console.log('node');
			    //console.log('inside count');
			    leng++;
			});
			
			//console.log(s);
			
			if(leng >= 1){
			
				sys.parameters({
				    gravity: true,
				    friction: 0.1, 
				    repulsion : 00,
				    stiffness: 500
				});
		
				//console.log(sys.parameters());
			}
	
			
			return;
        }
        
        if(addedgemode){
        	//the user is adding an edge 
        	
        	if((edgepath.length == 0) || (edgepath.length == 1)){
        		edgepath.push(nearme);
        		//console.log('added edge to edge path');
        		//edgepath[0].node.name
        		
        		if(edgepath.length == 1){
        			$('#edgesource').text(edgepath[0].node.name);
        		}
			}
			
			if(edgepath.length == 2){
			$('#edgedestination').text(edgepath[1].node.name);
				//edge is full
				//build and erase
				//console.log(edgepath);
				
				$('#btn_addedge').removeClass('red').addClass('green');
				$('#btn_addedge').val('Add Edge');
				sys.addEdge(edgepath[0].node.name, edgepath[1].node.name);
				addedgemode = false;
				edgepath = new Array();
			}
			
			return;
        }
        
        if ($('#tabs-3').is(":visible")) {
        	//user has the edit tab visible, and has clicked the graph view
        	//show the edit form
        	$('#form_editnode').show();
        	$('#edit_notice').hide();
           //console.log('edit tab is visible');
           displayEditNodePrefs(nearme);
           
           
        }

    });
    
    $('#editnode_tab_button').click(function (evt){
    
    	$('#edit_notice').show();
    });
    
    $(window).scroll(function(event){
        if(addnodemode){
        event.preventDefault();
        } 
    })

    $('body').mousedown(function (evt) {
        //console.log(evt);
        if ((evt.target.className.indexOf('search_result') != -1) || (evt.target.parentElement.className.indexOf('search_result') != -1)) {
			
            adding = true;
            	

            
            //$('body').addClass('unselectable');
            $('#search_results_holder').css('overflow-x', 'hidden');
            $('search_results_holder').addClass('stop-scroll');
            //console.log('article clicked');
            //console.log(evt);

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
                }, {
                    name: 'NEAREST',
                    val: false
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
                }, {
                    name: 'NEAREST',
                    val: false
                }];

            }
            //console.log(attribs_article);
            
            
            //provide a ui conformation that a article is being dragged
            //alert the user
            var op = new Object();
            op.w = 300;
            op.h = 70;
            op.title = "Adding Article!";
            op.subtext = "release near destination to add";
            
            
            note('#contain_main', op);
            
            
            data_to_add = attribs_article;
        }
    });



    $('body').mouseup(function (e) {

        $('body').removeClass('unselectable');
        $('search_results_holder').removeClass('stop-scrolling');

        if (adding) {
            //preload the image 
			 $('#search_results_holder').css('overflow-x', 'scroll');
            var prefetch = new Image();
            prefetch.src = data_to_add[3].val;
            data_to_add['imagedata'] = prefetch;

            adding = false;

            //console.log('event');
            //console.log(e);

            var len = 0;




            var nearme_ = sys.nearest({
					x: e.pageX - 270,
					y: e.pageY - 50
            });

            var res;

            if (nearme_) {

                res = sys.addNode(ct + '', data_to_add);
                sys.addEdge(nearme_.node.name, ct + '');
            } else {
                res = sys.addNode(ct + '', data_to_add);
            }

            if (res) {
                //console.log('returned something');
                //console.log(res);
            } else {
                //console.log('returned nothing');
            }



            sys.eachNode(function (node, pt) {
                //console.log('node');
                //console.log(node);
                len++;
            });
            
            
            
            var op = new Object();
            op.w = 300;
            op.h = 70;
            op.title = "Added Article!";
            op.subtext = "Article bound to node " + nearme_.node.name;
            
            
            note('#contain_main', op);

            //console.log('ct: ' + len);

            ct++;



        }
        
        socket.on('hs_id', function (data) {
            socket.id = data.data;
            //console.log('client : recieved id ' + socket.id + ' from server');
        });
    
        socket.on('request_pullGraph_success', function (data) {
            //console.log('client : pullGraph request successful, result:');
            //console.log(data.data);
            rebuildPullGraph(data.data);
        });
        
        socket.on('SAVE_SUCCESS', function (data){
        
        if(waiting_save_confirm){
        	console.log('got save confirm');
        	waiting_save_confirm = false;
        	console.log($('#updatelabel').height() +"px");
        	$('#savepanel').css("height",$('#updatelabel').height() +10 +"px");
        	$('#updatelabel').show();
        }
    
        	
        });
        
        socket.on('PUBLISH_SUCCESS', function (data){
        
        if(waiting_publish_confirm){
        console.log('got publish confirm');
        	waiting_publish_confirm = false;
        	
        	 $('#savepanel').css("height",$('#updatelabel').height() +10 +"px");
        	 $('#savepanel').css("background-color",'#ffffff');
        	 var date = new Date();
        	 $('#lastsave').text(" " + date);
        	 $('#updatelabel').show();
        }
        	
        });
        
        
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

 	function displayEditNodePrefs(n){
 	
 		//after the information is passed to the view to show the user may change the
 		//node name, in order to edit the old node, save the name in a var
 		
 		current_edit_focus = n.node.data['name'];
 		//get a node and draw it to the tab window
 		
 		        //validate form
 		        //console.log(n);
 		
 		        $('#field_edit_node_name').val(n.node.data['name']);
 		        $('#field_edit_node_text').val(n.node.data['text']);
 		        $('#field_edit_node_link').val(n.node.data['link']);
 		        $('#field_edit_node_size').val(n.node.data['size']);
 		        $('#picker_edit_edgecolor').val(n.node.data['color']);
 	}

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
    
    function flipSaveButton(){
    	
    	if($('#btn_publishgraph').hasClass('positive')){
    		$('#btn_publishgraph').removeClass('positive');
    		$('#btn_savegraph').addClass('positive');
    	}else{
	    	$('#btn_publishgraph').addClass('positive');
	    	$('#btn_savegraph').removeClass('positive');
    	}
    
    }

	
	function transportSaveState(ss){
	
			socket.emit('USER_SAVEGRAPH', {payload: ss});
			
			if(ss.publish){
				waiting_publish_confirm = true;
				console.log('waiting publish confirm');
			}else{
				waiting_save_confirm = true;
				console.log('waiting save confirm');
			}

		
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
    
    $('#btn_publishgraph').click(function () {
    
    //open up the save console
    $('#search_results_holder').height(0);
    $('#savepanel').css("height","150px");
    $('#savepanel').css("background-color","#564F8A");
    
    
    var name = $('#sp_graphname').val();
    var desc = $('#sp_graphdesc').val();
    
    $('#sp_graphname').val('');
    $('#sp_graphdesc').val('');
    
    //console.log('namedesc: ' + name + ' ' +desc);
    if((name != '') && (desc != '')){
    	transportSaveState(getSaveState(sys, name, desc, 1));
    	
    	console.log('sent publish graph data');
    }
    		//transportSaveState(getSaveState(sys));
    });

    $('#btn_savegraph').click(function () {
    
    //open up the save console
    $('#search_results_holder').height(0);
    $('#savepanel').css("height","100px");
    $('#savepanel').css("background-color","#564F8A");
    flipSaveButton();
    
    var name = $('#sp_graphname').val();
    var desc = $('#sp_graphdesc').val();
    
    //console.log('namedesc: ' + name + ' ' +desc);
    if((name != '') && (desc != '')){
    	transportSaveState(getSaveState(sys, name, desc, 0));
    	
    	console.log('sent graph data');
    }
  		//transportSaveState(getSaveState(sys));
    });

    $('.edittab').click(function (evt) {
    
    var target = evt.target || evt.srcElement;

        $('.edittab').removeClass('active');

        $(target).addClass('active');
        $(target).addClass('purple');
        //console.log(evt.srcElement.attributes[0].nodeValue);

        $('#tabs-1').hide();
        $('#tabs-2').hide();
        $('#tabs-3').hide();
        $('#tabs-4').hide();
        $('#form_editnode').hide();
        
       	console.log('hshhshs');
		console.log(evt);
		console.log(target.getAttribute('tablink'));
		$(target.getAttribute('tablink')).show();

        
    });

    $('#btn_export').click(function (e) {

        var xport_string = "";


        sys.eachNode(function (node, pt) {
            //console.log(node);
            if (node.data[4]) {
                if (node.data[4].val == 'article') {
                    //console.log('has data 4');
                    //title Available From <URL>
                    //an article has been found, need to export this to the list
                    xport_string += node.data[2].val + " Available From <" + node.data[0].val + ">\n\n";
                }


            } else {
                //console.log(node);
                if (node.data['TYPE'] == 'TEXT') {
                    //the node is a text node add it and format appropriatley
                    xport_string += node.data['name'] + " Available From <" + node.data['link'] + ">\n\n";
                }
            }
        });

        //console.log(xport_string);

        var blob = new Blob([xport_string], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(blob, "reference list.txt");




    });
    
	function updateEditNodePrefs(){
	
	        var updatededits = new Object();
	        
	        //validate form
	
	        updatededits['name'] = $('#field_edit_node_name').val();
	        updatededits['text'] = $('#field_edit_node_text').val();
	        updatededits['link'] = $('#field_edit_node_link').val();
	        updatededits['size'] = $('#field_edit_node_size').val();
	        updatededits['id'] = get_random_color();
	        updatededits['color'] = $('#picker_edit_edgecolor').val();
	        updatededits['TYPE'] = 'TEXT';
	        
	        
	        if(updatededits['name'] == ""){
	        	$('#field_edit_node_name').addClass('errorform');
	        	return -1;
	        }else{
	        	$('#field_edit_node_name').removeClass('errorform');
	        	return updatededits;
	        }
	

	}

	function updateAddNodePrefs(){
	
	        var updated = new Object();
	        
	        //validate form
	
	        updated['name'] = $('#field_node_name').val();
	        updated['text'] = $('#field_node_text').val();
	        updated['link'] = $('#field_node_link').val();
	        updated['size'] = $('#field_node_size').val();
	        updated['id'] = get_random_color();
	        updated['color'] = $('#picker_edgecolor').val();
	        updated['TYPE'] = 'TEXT';
	        
	        
	        if(updated['name'] == ""){
	        	$('#field_node_name').addClass('errorform');
	        	return -1;
	        }else{
	        	$('#field_node_name').removeClass('errorform');
	        	return updated;
	        }
	

	}
	
	$('input').on('input',function (e){
	
		var itemclass = e.srcElement.className;
		
		if(itemclass.indexOf("add")){
			addnodePREFS = updateAddNodePrefs();
		}
		
		if(itemclass.indexOf("edit")){
			editnodePREFS = updateEditNodePrefs();
		}
		
	});
	
	$('#btn_addedge').click(function (evt){
		if(!addedgemode){
		addedgemode = true;
		$('#btn_addedge').removeClass('green').addClass('red');
		$('#btn_addedge').val('cancel');
		}else{
		//cancel
		$('#btn_addedge').removeClass('red').addClass('green');
		$('#btn_addedge').val('Add Edge');
		addedgemode = false;
		}
	});
	
	$('#btn_editnode').click(function (evt){
	//console.log(editnodePREFS);
	
	//editnodePREFS['color'] = 'aliceblue';
	
		sys.tweenNode(current_edit_focus, 0.5, editnodePREFS);
		$('#form_editnode').hide();
		$('#edit_notice').show();
		
	});

    $('#btn_addnode').click(function () {
    
    if(addnodemode){
    	//the user wants to cancel the addnode operation
    	$('#btn_addnode').removeClass('red').addClass('green');
    	$('#btn_addnode').val('Add Node');
    	addnodemode = !addnodemode;
    	$('#node-dropper').remove();
    }else{
    
    		//validate form input
    		
    		addnodePREFS = updateAddNodePrefs();
    		
    		if(addnodePREFS != -1){
    		
    			        addnodemode = true;
    			        $('#btn_addnode').removeClass('green').addClass('red');
    			        $('#btn_addnode').val('cancel');
    			        $( "body" ).append( '<div id="node-dropper"></div>' );
    			        
    			        var op = new Object();
    			        op.w = 300;
    			        op.h = 70;
    			        op.title = "Adding node!";
    			        op.subtext = "click to place the node : ";
    			        //console.log('dhdhdhhdhdhdh');
    			        
    			        note('#contain_main', op);
    		}else{
    			//addnodeprefs returned a -1, [so form was not valid
    			//issue an error
    			
    			alert('form invalid, please enter a name for the node ');
    		}
    		
    	

    
    }




    });


});