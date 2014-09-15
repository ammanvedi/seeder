
$(document).ready(function () {

    //variable to store the current index for use with the Google Custom Search API calls 
    var next_page_idx = 0;
    var term;
    //hide the container of the search results
    //its not needed when no results are being shown
    $('#search_results_holder').height(200);
    //this function is passed the searchterm 
    //search('mendeley');
    
    
    function search(trm) {

        term = trm;
        //re-extend the search results holder, to show the results to the user
        $('#search_results_holder').height(300);
        //use the httpget function to grab the custom google search
        //JSON DATA
        //var json_dta = httpGet('https://www.googleapis.com/customsearch/v1?key=AIzaSyDM8_gZ-5DQVcBUt1y7qq_wAjUDbr4YSTA&cx=009521426283403904660:drg6vvs6o2a&q=' + trm);
        add_results('/build/search/google/' + trm);
    }

    function add_results(json_results_url) {

        //remove the old 'load more' button so it can be added to the bottom of 
        //list again

        $('#load_more').remove();

        var json_dta = httpGet(json_results_url);
        //search results are stored in the 'items' array
        var json_objects = jQuery.parseJSON(json_dta);
        //console.log(jQuery.parseJSON( json_dta ));
        //console.log(jQuery.parseJSON( json_dta ).queries.nextPage[0].startIndex);
        //next_page_idx = jQuery.parseJSON(json_dta).queries.nextPage[0].startIndex;
        json_objects.forEach(function (itm) {

            //for each result, add a corresponding search result division to the search
            //results container
            //console.log(itm);

            jQuery('<div/>', {
                class: 'sr',
                URL: itm.URL,
                DESCRIPTION: itm.DESCRIPTION,
                TITLE: itm.TITLE,
                IMAGE: itm.IMAGE,
                TYPE: 'ARTICLE',
                DOMAIN: itm.DOMAIN,
                html: '  <div class="sr-left-text">
                      <h1>' + itm.TITLE + '</h1>
                          <div class="sr-article-link"><a target="_blank" href=" ' + itm.URL + '"> ' + itm.DOMAIN + '</a><i class="hand right icon"></i></div>
                          <p>' + itm.DESCRIPTION + '</p>
                          </div>
                          <div class="sr-right-image"><img src="' + itm.IMAGE + '"><div class="sr-image-overlay"></div>
                          <i class="result_adder add icon"></i>
                          </div>
                      </div>
                  </div>'


            }).appendTo('#search_results_holder');
            
              /*
            
            	          '  <div class="sr-left-text">
            		            <h1>' + itm.title + '</h1>
            			            <div class="sr-article-link"><a href=" ' + itm.link + '"> ' + itm.displayLink + '</a><i class="hand right icon"></i></div>
            			            <p>' + itm.snippet + '</p>
            			            </div>
            			            <div class="sr-right-image"><img src="' + itm.pagemap.cse_image[0].src + '"><div class="sr-image-overlay"></div>
            			            <i class="result_adder add icon"></i>
            			            </div>
            		            </div>
            	            </div>'
            
            
          
            
      
	            <div class="sr-left-text">
		            <h1>Article Heading Goes Here</h1>
			            <div class="sr-article-link"><a href="http://www.google.com">www.nytimes.com</a><i class="hand right icon"></i></div>
			            <p>A description of the article's contents will go here and should be truncated if too long</p>
			            </div>
			            <div class="sr-right-image"><img src="http://placehold.it/90x90.png"><div class="sr-image-overlay"></div>
			            <i class="result_adder add icon"></i>
			            </div>
		            </div>
	            </div>
   

					*/
				
				
        });

        jQuery('<div/>', {
            id: 'load_more',
            class: 'load_more',
            html: '<p>load more</p>'
        }).appendTo('#search_results_holder');


    }

    function get_next_page() {

        var next_url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDM8_gZ-5DQVcBUt1y7qq_wAjUDbr4YSTA&cx=009521426283403904660:drg6vvs6o2a&q=' + term + '&start=' + next_page_idx;
        add_results(next_url);
    }


    function httpGet(theUrl) {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    //on click of the search button, take the input in the text
    //field and pass it to the search function
    $('#btn_searcharticles').click(function () {
        next_page_idx = 0;
        $('.search_result').remove();
        search($('#input_searcharticles').val());

    });


    document.body.addEventListener("mousedown", function (evt) {
        //console.log(evt);
        if ((evt.target.className == 'load_more') || (evt.target.parentElement.className == 'load_more')) {

            get_next_page();
        }
    });

});