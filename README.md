[![Build Status](https://travis-ci.org/ammanvedi/seeder.svg?branch=v2_arbor)](https://travis-ci.org/ammanvedi/seeder)

![Seeder](http://i.imgur.com/N2ADOo2.png)

#(with arbor)

This branch holds a version of seeder that uses arbor to render graphs instead of sigmajs.

Seeder web application that will provide a platform for the creation and sharing of mind maps / knowledge graphs. The ultimate goal of seeder is to allow for any data (web or locally based) to become part of the knowledge map.

Seeder is currently under development version one can be found at [Seeder.co](http://www.seeder.co/)


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


### Future Features 

The following will be added 

 * add graph search
 * Use Mendeley API in search results [(module written)](https://github.com/ammanvedi/MendeleyJSAnonymous)
 * Build minified + uglified scripts with grunt
 * unit tests


 
### Architecture / Structure

The application uses a node.js (express) server (app.js), with Jade layouts. The graph drawing is done with [arbor](http://arborjs.org/)

The core of the client application logic is written in javascript and is largely contained in /public/javascripts/graphhandler.js

The backend is a combination of MongoDB for the graph data storage, and MYSQL for everything else. This approach allows me to maintain the structure of the graph data so its intricacies can be queried (in future)

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
* [MendeleyJS](https://github.com/ammanvedi/MendeleyJS)
* [Hooker](https://github.com/ammanvedi/hooker)
* [jQuery](https://github.com/jquery/jquery)
* [Socket.IO](https://github.com/learnboost/socket.io)
* [Google Custom Search API](https://developers.google.com/custom-search/)
* [NodeJS](http://nodejs.org/)
* [ExpressJS](http://expressjs.com/)
* [Semantic UI](http://semantic-ui.com/)


### Status

I am coding as fast as i can 