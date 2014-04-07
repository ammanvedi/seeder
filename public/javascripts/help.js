/*!
*
*/


$(document).ready(function() {
var  MainSidebarhelp = $('.ui.sidebar');
MainSidebarhelp.sidebar('toggle');
MainSidebarhelp.sidebar('attach events','#sidebar-toggle' , 'toggle');

});