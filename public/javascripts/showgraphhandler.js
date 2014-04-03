$(document).ready(function () {

var testgraphdata=$.parseJSON('{"_id":{"$oid":"5318d8c462bac5193076a35d"},"graphid":"abc2","publish":1,"author":"https://www.google.com/accounts/o8/id?id=AItOawlJjvaxNnI6wDtBtRzV2Z9DmX9yCtDdvyk","graphname":"kk","graphdesc":"poononin","graph":{"root0":{"layername":"root","parentlayer":"0","nodes":[{"nodename":"Start","nodedata":{"name":"Start","text":"loremipsum","link":"http://www.google.com/","TYPE":"TEXT","size":30,"id":0,"color":"#564F8A"}},{"nodename":"loool","nodedata":{"name":"loool","text":"","link":"","size":"20","id":"#448D4C","color":"#000000","TYPE":"LAYER","parentlayer":"root"}},{"nodename":"kkkkloool","nodedata":{"name":"kkkkloool","text":"","link":"","size":"20","id":"#782E79","color":"#000000","TYPE":"TEXT"}},{"nodename":"2","nodedata":{"URL":"http://www.forbes.com/profile/kanye-west/","DESCRIPTION":"KanyeWest.More+.Earnings;$20Million;AsofJune2013.FollowFollowingUnfollow.Musician.Age:36.SourceOfWealth:Music,SelfMade.Residence:Los...","TITLE":"KanyeWest-Forbes","IMAGE":"http://i.forbesimg.com/media/lists/people/kanye-west_416x416.jpg","TYPE":"ARTICLE","DOMAIN":"www.forbes.com","NEAREST":true}},{"nodename":"3","nodedata":{"URL":"http://www.nytimes.com/2013/06/16/arts/music/kanye-west-talks-about-his-career-and-album-yeezus.html?pagewanted=all","DESCRIPTION":"Jun11,2013...ButthereisnorestatShangri-la,atleastforKanyeWest.ForseveraldaysinlateMayandearlyJune,heandarotatinggroupofintimates,...","TITLE":"KanyeWestTalksAboutHisCareerandAlbum\'Yeezus\'-NYTimes...","IMAGE":"http://www.nytimes.com/images/2013/06/16/arts/16SUBKANYE/16SUBKANYE-thumbStandard-v2.jpg","TYPE":"ARTICLE","DOMAIN":"www.nytimes.com","NEAREST":true}},{"nodename":"4","nodedata":{"URL":"http://www.forbes.com/sites/hannahelliott/2014/01/18/kanye-wests-complete-monologue-from-his-apc-collaboration-at-paris-fashion-week/","DESCRIPTION":"Jan18,2014...TonightinParisatA.P.C.headquartersalongRueMadamKanyeWestshowedgarmentsfromhislatestcollaborationwiththe27-year-old...","TITLE":"KanyeWest\'sCompleteMonologueFromHisAPCCollaborationAt...","IMAGE":"http://b-i.forbesimg.com/hannahelliott/files/2014/01/c0f94f6c6a726d0b667fe24147b32d79_37906.png","TYPE":"ARTICLE","DOMAIN":"www.forbes.com","NEAREST":true}},{"nodename":"5","nodedata":{"URL":"http://www.vibe.com/tags/kanye-west","DESCRIPTION":"KanyeWestPostponesAustralianTourToRecordNewAlbum.KanyeWestputshis...KanyeWestReportedlyBookedAtL.A.PoliceStationInUnderAnHour.","TITLE":"KanyeWest|Vibe","IMAGE":"http://www.vibe.com/sites/vibe.com/files/styles/smashable_grid_2/public/article_teaser_images/kanye-west_14.jpg","TYPE":"ARTICLE","DOMAIN":"www.vibe.com","NEAREST":true}}],"edges":[{"fromnode":"Start","tonode":"loool"},{"fromnode":"Start","tonode":"kkkkloool"},{"fromnode":"Start","tonode":"2"},{"fromnode":"Start","tonode":"3"},{"fromnode":"Start","tonode":"4"},{"fromnode":"Start","tonode":"5"}]},"loool0":{"layername":"loool","parentlayer":"root","nodes":[{"nodename":"loool","nodedata":{"name":"loool","text":"","link":"","size":"20","id":"#448D4C","color":"#000000","TYPE":"LAYER","parentlayer":"root"}}],"edges":[]}},"graphmeta":{"datecreated":1396537605731,"likes":0,"dislikes":0,"views":0},"authorname":"AmmanVedi"}');


sys = arbor.ParticleSystem(0, 500, 1.0) //repulsion/stiffness/friction
sys.parameters({
    gravity: true,
    friction: 1.0, 
    repulsion : 0
});
sys.renderer = Renderer("#view_canvas");

console.log(testgraphdata);

var GraphLayers = testgraphdata.graph;
var currentlayer = 'root';



loadLayer('root');

//clear the current particle system and load a new layer
function loadLayer(layertoload){

	currentlayer = layertoload;

   layertoload = layertoload +'0'; 
    
if(GraphLayers[layertoload])
{
	sys.prune(function (a,b,c){
		return true;
	});
	
	GraphLayers[layertoload].nodes.forEach(function(val, idx, ar){
	
	
	if(val.nodedata['TYPE'] == 'ARTICLE'){
	var prefetch = new Image();
	prefetch.src = val.nodedata['IMAGE'];
	//console.log(val.nodedata['IMAGE']);
	val.nodedata['imagedata'] = prefetch;
	}
	
		sys.addNode(val.nodename, val.nodedata);
		

		
		
	});
	
	GraphLayers[layertoload].edges.forEach(function(val, idx, ar){
		sys.addEdge(val.fromnode, val.tonode);
	});
	
	
}else{
	console.log('layer not found');
}
	
}

});