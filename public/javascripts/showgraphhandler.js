$(document).ready(function () {

console.log('dagraph');
console.log(graphstring);

var DEPLOYIP = '192.168.0.6'; //localhost for dev, ip for prod
var socket = io.connect(DEPLOYIP + ':8080');

    var testgraphdata = graphstring;

    sys = arbor.ParticleSystem(1000, 1000, 0.5) //repulsion/stiffness/friction
    sys.parameters({
        gravity: true,
        friction: 1.0,
        repulsion: 0
    });
    sys.renderer = Renderer("#view_canvas");

    console.log(testgraphdata);

    var GraphLayers = testgraphdata.graph;
    var currentlayer = 'root';



    loadLayer('root');

    $('#view_canvas').dblclick(function (a) {

        sys.start();

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
                if (nearme.node.data['name'] == currentlayer) {

                    loadLayer(GraphLayers[currentlayer + '0'].parentlayer);
                } else {
                    //layer node clicked is pointing to a different layer
                    //load it 
                    loadLayer(nearme.node.data['name']);
                }


            }
        }

    });

    //clear the current particle system and load a new layer
    function loadLayer(layertoload) {

        currentlayer = layertoload;
        layertoload = layertoload + '0';

        if (GraphLayers[layertoload]) {
            sys.prune(function (a, b, c) {
                return true;
            });

            GraphLayers[layertoload].nodes.forEach(function (val, idx, ar) {


                if (val.nodedata['TYPE'] == 'ARTICLE') {
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