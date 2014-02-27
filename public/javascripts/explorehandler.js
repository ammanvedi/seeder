$(document).ready(function() {

var  MainSidebarExplore = $('.ui.sidebar');

MainSidebarExplore.sidebar('toggle');
MainSidebarExplore.sidebar('attach events','#sidebar-toggle' , 'toggle');

console.log('lol');

});