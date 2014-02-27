# Seeder (with arbor)

This branch holds a version of seeder that uses arbor to render graphs instead of sigmajs.

Seeder is an under-development web application that will provide a platform for the creation and sharing of mind maps / knowledge graphs. The ultimate goal of seeder is to allow for any data (web or locally based) to become part of the knowledge map.

![Seeder proof of concept screenshot](http://i.imgur.com/ligd0J8.png)

there is a video [here](http://youtu.be/879IhcXFcpU)


The following feautures are currently implemented

 * Basic graph creation (node and edge addition)
 * Saving of graph data to a MongoDB Server
 * Addition of nodes to the graph via drag and drop from the article search
 * Viewing node attributes (Title, URL, Description, Image)
 * Addition of node by mouse click 
 

The search system currently returns results from the following sites : Wall Street Journal, Forbes, Vibe (Music/Entertainment), National Geographic, Harvard Business Review, JSTOR (Research Articles), Reuters, The Guardian (Tabloid), Financial Times, Time Magazine, New York Times, Wordpress, Blogger, Yahoo News, BBC News.

More sources will be added over time, subject to requirement.
 
### Architecture / Structure

The application uses a node.js (express) server (app.js), with Jade layouts. The graph drawing is done with [arbor](http://arborjs.org/)

The core of the application logic is written in javascript and is largely contained in /public/javascripts/graphhandler.js

### Running the Code

```javascript
$ git clone https://github.com/ammanvedi/seeder.git seeder
$ cd seeder
$ node app
```
and then navigate to http://localhost:3000/ in your web browser

### Dependancies / Acknowledgement

The following have been used in the development of Seeder

* [arborjs](http://arborjs.org/)
* [jQuery / jQuery UI](https://github.com/jquery/jquery)
* [Socket.IO](https://github.com/learnboost/socket.io)
* [BigSlide](https://github.com/ascott1/bigSlide.js)
* [Google Custom Search API](https://developers.google.com/custom-search/)
* [NodeJS](http://nodejs.org/)
* [ExpressJS](http://expressjs.com/)

### Status

The development has been carried out under Chrome 31.0.1650.63 and Safari 6.1

