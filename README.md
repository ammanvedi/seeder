# Seeder 

Seeder is an under-development web application that will provide a platform for the creation and sharing of mind maps / knowledge graphs. The ultimate goal of seeder is to allow for any data (web or locally based) to become part of the knowledge map.

![Seeder proff of concept screenshot](http://i.imgur.com/suraHQ2.png)

The following feautures are currently implemented

 * Basic graph creation (node and edge addition)
 * Saving of graph data to a MongoDB Server
 * Addition of nodes to the graph via drag and drop from an article search (BBC News, Yahoo News) via Google Custom Search API
 * Viewing node attributes (Title, URL, Description, Image)
 * Addition of node by mouse click
 
### Architecture / Structure

The application uses a node.js (express) server (app.js), with Jade layouts, to run the code on your local machine, 

```javascript
$ git clone https://github.com/ammanvedi/seeder.git seeder
$ cd seeder
$ node app
```
and then navigate to http://localhost:3000/ in your web browser

### Dependancies

The following have been used in the development of Seeder

* [SigmaJS](https://github.com/jacomyal/sigma.js/)
* [jQuery / jQuery UI](https://github.com/jquery/jquery)
* [Socket.IO](https://github.com/learnboost/socket.io)
* [BigSlide](https://github.com/ascott1/bigSlide.js)
