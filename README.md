# Seeder (with arbor)

This branch holds a version of seeder that uses arbor to render graphs instead of sigmajs.

Seeder is an under-development web application that will provide a platform for the creation and sharing of mind maps / knowledge graphs. The ultimate goal of seeder is to allow for any data (web or locally based) to become part of the knowledge map.

![Seeder proof of concept screenshot](http://i.imgur.com/KnE5wZk.png)

there is a video of the poc [here](http://youtu.be/879IhcXFcpU)

### Live Site 

the domain is not up yet, so you can access the site via ip, or via the git url : http://ammanvedi.github.io/seederio/

| URL                               	| Description                                                                                       	|
|-----------------------------------	|---------------------------------------------------------------------------------------------------	|
| http://54.201.24.162:8080/build   	| The main interface for users to create and edit graphs                                            	|
| http://54.201.24.162:8080/explore 	| Displays graphs created by users and allows for searching of specific subject areas 	|
| http://54.201.24.162:8080/help    	| Help docs about the builder and other aspects of the site                                         	|
| http://54.201.24.162:8080/blog    	| The DevBlog, updated when changes are made to the site                                            	|
| http://54.201.24.162:8080/docs/    	| documentation for the main functions of the codebase are available here                                             	|


### Current Features 

The following feautures are currently implemented

 * Basic graph creation (node and edge addition)
 * Basic node editing
 * Addition of layers to graph to create visual heirarchy
 * Saving of graph data to a MongoDB Server
 * Publishing of graph to MongoDB, viewable by all users
 * Addition of nodes to the graph via drag and drop from the article search
 * Login via Google account (PassportJS)
 * Viewing node attributes (Title, URL, Description, Image)
 * Export of graph data to a textual reference list (Harvard format)
 * retrieval of graph data from MongoDB server
 * viewing of graphs created by users (via /explore)
 ![adding article](http://i.imgur.com/KYkyu04.gif)

*Adding an article to the map from a search*

The search system currently returns results from the following sites : Wall Street Journal, Forbes, Vibe (Music/Entertainment), National Geographic, Harvard Business Review, JSTOR (Research Articles), Reuters, The Guardian (Tabloid), Financial Times, Time Magazine, New York Times, Wordpress, Blogger, Yahoo News, BBC News.

More sources will be added over time, subject to requirement.

### Future Features 

The following will be added 

 * add graph search
 * Use Mendeley API in search results [(module written)](https://github.com/ammanvedi/MendeleyJSAnonymous)
 * Build minified + uglified scripts with grunt
 * unit tests


 
### Architecture / Structure

![overall architecture](http://i.imgur.com/EDjGZXG.png)

The application uses a node.js (express) server (app.js), with Jade layouts. The graph drawing is done with [arbor](http://arborjs.org/)

The core of the application logic is written in javascript and is largely contained in /public/javascripts/graphhandler.js

### Running the Code

```javascript
$ git clone https://github.com/ammanvedi/seeder.git seeder
$ cd seeder
$ npm install
$ node app
```
and then navigate to http://localhost:3000/ in your web browser

### Dependancies / Acknowledgement

The following have been used in the development of Seeder

* [arborjs](http://arborjs.org/)
* [MendeleyJSAnonymous (homebrew)](https://github.com/ammanvedi/MendeleyJSAnonymous)
* [Hooker (homebrew)](https://github.com/ammanvedi/hooker)
* [jQuery](https://github.com/jquery/jquery)
* [Socket.IO](https://github.com/learnboost/socket.io)
* [Google Custom Search API](https://developers.google.com/custom-search/)
* [PassportJS (google auth)](http://passportjs.org/)
* [NodeJS](http://nodejs.org/)
* [ExpressJS](http://expressjs.com/)
* [Semantic UI](http://semantic-ui.com/)


### Status

The development has been carried out under Chrome 31+ and Safari 6.1+, firefox and opera, i have found MAJOR bugs when running in IE, these are not a priority until the product is feature complete.

Bugs may appear in non-webkit browsers, open an issue.
