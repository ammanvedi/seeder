$(document).ready(function () {
$('#info_title').attr("target", "_blank");
var  MainSidebarhelp = $('.ui.sidebar');
MainSidebarhelp.sidebar('toggle');
MainSidebarhelp.sidebar('attach events','#sidebar-toggle' , 'toggle');


    var testgraphdata = graphstring;

    sys = arbor.ParticleSystem(20, 100, 0.5) //repulsion/stiffness/friction
sys.parameters({
    gravity: true,
    friction: 0.1, 
    repulsion : 00,
    stiffness: 500
});
    sys.renderer = Renderer("#view_canvas");

    console.log(testgraphdata);

    var GraphLayers = testgraphdata.graph;
    var currentlayer = '-1';



    loadLayer('-1');
    
    $('body').mousemove(function (e) {
        
var mouse = {
    x: e.pageX - 270,
    y: e.pageY - 50
};

    
            nearestmouse = sys.nearest(mouse);
    
            if (nearestmouse) {
            //console.log(nearestmouse);
    
                if (nearestmouse.node.data['TYPE'] == 'ARTICLE') {
                    nearestmouse.node.data['NEAREST'] = true;
                    $('#info_title').text(nearestmouse.node.data['TITLE']);
                    $('#info_domain').text(nearestmouse.node.data['DOMAIN']);
                    $('#info_description').text(nearestmouse.node.data['DESCRIPTION']);
                    $('#info_image').attr("src", nearestmouse.node.data['IMAGE']);
                    $('#info_title').attr("href", nearestmouse.node.data['URL']);
                    //console.log(nearestmouse.node);
                } else {
                    //console.log('id is : ' + nearestmouse.node.name);
    
                }
    
            }
         });

    $('#view_canvas').dblclick(function (a) {

        //

        var nearme = sys.nearest({
            x: a.offsetX,
            y: a.offsetY
        });
        

        //console.log(nearme);
        if (nearme.distance < 20) {
            //console.log('direct click on a node');
            if (nearme.node.data['TYPE'] == 'LAYER') {
                //if the layer node clicked corresponds to this layer
                //then exit the layer
                if (nearme.node.data['nodeid'] == currentlayer) {
					//console.log('da layer is ' + currentlayer);
                    loadLayer(GraphLayers[currentlayer + 'z'].parentlayer);
                    
                } else {
                    //layer node clicked is pointing to a different layer
                    //load it 
                    loadLayer(nearme.node.data['nodeid']);
                }


            }
        }

    });

    //clear the current particle system and load a new layer
    function loadLayer(layertoload) {
    
    console.log(GraphLayers);
    
    

        currentlayer = layertoload;
        layertoload = layertoload + 'z';

        if (GraphLayers[layertoload]) {
            sys.prune(function (a, b, c) {
                return true;
            });
            
            
            GraphLayers[layertoload].nodes.forEach(function (val, idx, ar) {
			console.log(val);

                if (val.nodedata['TYPE'] == 'ARTICLE')
                {
                    var prefetch = new Image();
                    prefetch.src = val.nodedata['IMAGE'];
                    val.nodedata['imagedata'] = prefetch;
                }
                
                sys.addNode(val.nodename, val.nodedata);
               
            });

            GraphLayers[layertoload].edges.forEach(function (val, idx, ar) {
                sys.addEdge(val.fromnode, val.tonode);
            });
            
        } else {
            console.log('layer not found');
        }

    }

});