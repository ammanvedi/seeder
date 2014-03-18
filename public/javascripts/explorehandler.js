$(document).ready(function() {

var DEPLOYIP = '192.168.0.2'; //localhost for dev, ip for prod
var socket = io.connect(DEPLOYIP + ':8080');
console.log( socket);

socket.emit('SERVE_EXPLORE_HOMEPAGE',{});

socket.on('EXPLORE_SERVE_RESPONSE', function (data) {
    //console.log('client : pullGraph request successful, result:');
    //console.log(data.data);
    console.log(data);
});

var  MainSidebarExplore = $('.ui.sidebar');

//MainSidebarExplore.sidebar('toggle');
MainSidebarExplore.sidebar('attach events','#sidebar-toggle' , 'toggle');

console.log('lol');

});