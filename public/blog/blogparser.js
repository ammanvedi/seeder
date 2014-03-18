function generateBlogPosts(posts){
	// passed a javascript object of posts
		//posts[x]
			//post[x]
				//type
				//data
			//title
			//date 
			//author
	var container = $('.postcontainer');
	
	console.log('running');
	
	posts.forEach(function (postdataarray){
	
	
	var postouter = $('<div class="ui piled purple segment"></div>');
	var postdata = $('<div class="postdata"></div>');
	
	postdata.append('<h2 >' + postdataarray.title +'</h2>');
	postdata.append('<img class="ui mini right floated image" src="https://0.gravatar.com/avatar/4a373cf3edb4c83ae97249e6e5ef19d4?d=https%3A%2F%2Fidenticons.github.com%2F7ec612f35a07b9a83f2f7086d152decb.png&r=x&s=460"></img>');
	postdata.append('<div id="clear"></div>');
	postdata.append('<h3>by ' + postdataarray.author + ' on ' + postdataarray.date + '</h3>');
	
	
		console.log('new el');
		postdataarray.post.forEach(function (partialpost){
			if(partialpost.type == 'text'){
			console.log('textpost');
			postdata.append('<p>' + partialpost.data +'</p>');
			}
			if(partialpost.type == 'image'){
			console.log('imgpost');
			var postimg = $('<div class="postimage"></div>')
			postimg.append('<img src="'+ partialpost.data +'"></img><p>' + partialpost.subtitle + '</p>');
			postdata.append(postimg)
			}
		});

	postouter.append(postdata);
	postouter.append('<div class="btn_readmore ui fluid basic button"><i class="icon add"></i>Read More </div>');
	
	
	container.append(postouter);
	
	});



}