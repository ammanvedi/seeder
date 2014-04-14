$(document).ready(function() {

/**
 * generate a random hex color string (#123ABC)
 * @return {String} The randomly generated hex color reference
 */
function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}
/*!
*
*/

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return 'rgba('+parseInt(result[1], 16)+', '+parseInt(result[2], 16)+', '+parseInt(result[3], 16)+', 0.3)';
}

var  MainSidebarExplore = $('.ui.sidebar');

//MainSidebarExplore.sidebar('toggle');
MainSidebarExplore.sidebar('attach events','#sidebar-toggle' , 'toggle');

$('.circholder').each(function (){

$(this).css('background-color',hexToRgb(get_random_color()));
});



});