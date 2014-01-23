$(document).ready(function () {


  var test_nodes = 0;
  var is_adding_article = false;

  $('body').nonbounce();

    //create a socket to connect to the server
    //this net
    var socket = io.connect('http://localhost:3000');


    // 2.4278765515909404

    // 0.2625419675446003

    //actual
    //2.465708068894392
    //0.38719854739982723

    $("input[type=submit]").button();
    $('#graph_tab').height($("body").height());
    $('#text_tab').height(0);
    $('.menu-link').bigSlide();

    //test data 
    $('#graph_canvas').html('<ul><li><a href="http://kenneth.kufluk.com/blog/">Kenneth</a><ul><li><a href="http://twitter.com/kennethkufluk" target="_blank" class="icon twitter">Twitter</a></li><li><a href="http://www.linkedin.com/in/kennethkufluk" target="_blank" class="icon linkedin">LinkedIn</a></li><li><a href="http://www.facebook.com/kenneth.kufluk" target="_blank" class="icon facebook">Facebook</a></li><li><a href="http://feeds.feedburner.com/KennethKufluk" target="_blank" class="icon rss">RSS Feed</a></li><li><a href="http://kenneth.kufluk.com/blog/">Blog categories</a><ul><li><a href="http://kenneth.kufluk.com/blog/blog/general/" title="View all posts filed under General">General</a></li><li><a href="http://kenneth.kufluk.com/blog/blog/personal/" title="View all posts filed under Personal">Personal</a></li><li><a href="http://kenneth.kufluk.com/blog/blog/physics/" title="View all posts filed under Physics &amp;Astronomy">Physics &amp;Astronomy</a></li><li><a href="http://kenneth.kufluk.com/blog/blog/projects/" title="View all posts filed under Projects">Projects</a></li><li><a href="http://kenneth.kufluk.com/blog/blog/rant/" title="View all posts filed under Ranting">Ranting</a></li><li><a href="http://kenneth.kufluk.com/blog/blog/work/" title="View all posts filed under Work">Work</a></li></ul></li><li><a href="http://kenneth.kufluk.com/blog/">Pages</a><ul><li><a href="http://kenneth.kufluk.com/blog/about/" title="About Kenneth">About Kenneth</a></li><li><a href="http://kenneth.kufluk.com/blog/work/" title="Employment">Employment</a></li><li><a href="http://kenneth.kufluk.com/blog/experiments/" title="Experiments">Experiments</a></li></ul></li><li><a href="http://kenneth.kufluk.com/blog/">Friends</a><ul><li><a href="http://coderonfire.com/" title="Coder on Fire" rel="friend met co-worker colleague neighbor">Andrew Mason</a></li><li><a href="http://www.wait-till-i.com" title="Wait till I come!" rel="met">Christian Heilmann</a></li><li><a href="http://www.danwebb.net" rel="friend met" title="Godlike JavaScript Guru">Dan Webb</a></li><li><a href="http://www.sitedaniel.com" rel="friend met co-worker colleague neighbor" title="Flash Whizz">Daniel Goldsworthy</a></li><li><a href="http://dean.edwards.name" rel="friend met" title="Godlike JavaScript Guru">Dean Edwards</a></li><li><a href="http://www.dotsonline.co.uk" title="My auntie&#8217;s music shop.">Dot&#8217;s Shop</a></li><li><a href="http://simonwillison.net/" title="PHP, Python, CSS, XML and general web development.">Simon Willison</a></li></ul></li></ul></li></ul>');


    //additional arrays to hold the nodes and edges
    var nodes = new Array();


    //init graph
    $('#graph_canvas').mindmap();

      var root = $('#graph_canvas>ul>li').get(0).mynode = $('#graph_canvas').addRootNode($('#graph_canvas>ul>li>a').text(), {
    href:'/',
    url:'/',
    onclick:function(node) {
      $(node.obj.activeNode.content).each(function() {
        this.hide();
      });
    }
  });
  $('#graph_canvas>ul>li').hide();
  var addLI = function() {
    var parentnode = $(this).parents('li').get(0);
    if (typeof(parentnode)=='undefined') parentnode=root;
      else parentnode=parentnode.mynode;
    
    this.mynode = $('#graph_canvas').addNode(parentnode, $('a:eq(0)',this).text(), {
//          href:$('a:eq(0)',this).text().toLowerCase(),
      href:$('a:eq(0)',this).attr('href'),
      onclick:function(node) {
        $(node.obj.activeNode.content).each(function() {
          this.hide();
        });
        $(node.content).each(function() {
          this.show();
        });
      }
    });
    $(this).hide();
    $('>ul>li', this).each(addLI);
  };
  $('#graph_canvas>ul>li>ul').each(function() { 
    $('>li', this).each(addLI);
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





    $('#btn_addnode').click(function () {


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