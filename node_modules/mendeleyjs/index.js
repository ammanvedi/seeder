var request = require('request');


module.exports = (function () {



    // A private counter variable
    var AccessToken = 0;
    var limit = 10;
    
 var getSearchResults = function (searchterm, donext) {

        //searchbase = 'https://api.mendeley.com/search/catalog
        //' + encodeURIComponent(searchterm) + '/';
        
        console.log('at:'+AccessToken+' '+searchterm);

  var options = {
      url: 'https://api.mendeley.com/search/catalog?query='+encodeURIComponent(searchterm)+'&limit=' + limit,
      headers: {
      		"Authorization": 'Bearer '+ AccessToken,
      		"Accept":"application/vnd.mendeley-document.1+json",
      		"Content-Type": 'application/x-www-form-urlencoded'
          
          
      }
  };
  
  function callback(error, response, body) {
      //console.log(response,body);
     	donext(JSON.parse(body));
  }
  
  request(options, callback);

    }

    // A private function which logs any arguments
 var getAccessToken = function (cid, cs, auth_next) {
        tokenbase = 'https://api-oauth2.mendeley.com/oauth/token';

        //auth_next(tokenbase);
       // request.post('https://api.mendeley.com/oauth/token?client_id=163&client_secret=gv6XW8%3b49s%3blP-%3aY&grant_type=client_credentials', 
        
        var options = {
        		method : "POST",
            url: 'https://api.mendeley.com/oauth/token',
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            },
            form:{
            		client_id:"670",
            		client_secret:"56tRZjF2AqhWaMUv",
            		grant_type: "client_credentials"
            		}
        };
        
        function callback(error, response, body) {
            console.log(error,body.access_token);
            AccessToken = JSON.parse(body).access_token;
            auth_next(body);
        }
        
        request.post(options, callback);

    };

    return {

        // A public variable
        clientid: 0,
        clientsecret: 0,
        AccessTokenAPI: 0,

        // A public function utilizing privates
        auth: function (_id, _secret, next) {

            this.clientid = _id;
            this.clientsecret = _secret;

            // Call our private method using bar
            if ((this.clientid == 0) || (this.clientsecret == 0)) {
                next('err: client id or secret not present');
            } else {
                getAccessToken(this.clientid, this.clientsecret, next);
            }
            return;
        },

        search: function (term, resultHandler) {

            if (AccessToken == 0) {
                throw "Not Authenticated, use .auth method";
                resultHandler(null);
                return;
            } else {
                getSearchResults(term, resultHandler);
                return;
            }

        }
    } //end return 

})();