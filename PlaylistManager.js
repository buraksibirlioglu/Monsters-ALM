var playlistID;
function showPlaylist(userID) {
			console.log("playlist");   
			$.ajax({
                url: 'https://api.spotify.com/v1/users/'+userID+'/playlists',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
					console.log(response);
					var i;
					for (i = 0; i < response.items.length; i++) { 
						if(response.items[i].name == "orchestrion"){
							playlistID = response.items[i].id ; 
							trackCount = response.items[i].tracks.total;
							console.log("search");
							}	
					}
					printPlaylist() ;
                }
            });
	}
	
	function printPlaylist(){
		console.log(playlistID);
		if(playlistID){
			var inText=" ";
			document.getElementById("playlistTable").innerHTML="";
			
			for( j=0 ; j<(trackCount/100); j++){
				
				var offset = (j*100);
				playlist=[];
					$.ajax({
						method:'GET',
						url: 'https://api.spotify.com/v1/playlists/'+playlistID+'/tracks?offset='+offset+'',
						headers: {
						  'Authorization': 'Bearer ' + access_token
						},
						success: function(response) {
							console.log(response);
							for (i = 0; i < response.items.length; i++) { 
								inText+="<tr><td class='td_img' rowspan='2'><img src="+response.items[i].track.album.images[2].url+"></img></td><td>"+response.items[i].track.name+"</td><td rowspan='2' class='span4 text-right'><button class='removeButton' title='Remove' type='button' onClick=removeTrack('"+response.items[i].track.uri+"')><i class='fa fa-times fa-2x' style = 'color: white;'></i></button><button class='queueButton' title='Add to Queue' type='button' onClick=addQueue('"+response.items[i].track.uri+"')><i class='fa fa-plus-circle fa-2x' style = 'color: white;'></i></button></td></tr><tr><td>"+response.items[i].track.artists[0].name+"</td></tr>";
							}

							document.getElementById("playlistTable").innerHTML+=inText;

							var rows = document.getElementById("playlistTable").rows;
						    
							for (var i = 0; i < rows.length; i++) {
						  		if(i % 4 == 0 || i % 4 == 1)
						  			rows[i].className = "odd_tr"
						  		else
						  			rows[i].className = "even_tr"
							}
						}
				});
			}
		}
		else
			createPlaylist("orchestrion");
	}
		
	function addTrack(contextURI)
	{	
		console.log("add track func");
		var songInfo= " "; 
		var songReturn;
		$.ajax({
			method:'GET',
			url: 'https://api.spotify.com/v1/tracks/'+contextURI.substr(14,)+'',
			headers: {
				'Authorization': 'Bearer ' + access_token
			},
			success: function(response) {
				console.log(response);
				songReturn=response;
				songInfo="<tr><td class='td_img' rowspan = '2' ><img src="+response.album.images[2].url+"></img></td><td>"+response.name+"</td><td rowspan='2' class='span4 text-right'><button class='removeButton' type='button' onClick=removeTrack('"+response.uri+"')><i class='fa fa-times fa-2x' style = 'color: white;'></i></button><button class='queueButton' type='button' onClick=addQueue('"+response.uri+"')><i class='fa fa-plus-circle fa-2x' style = 'color: white;'></i></button></td></tr><tr><td>"+response.artists[0].name+"</td></tr>";
				$.ajax({
					method: "GET",
					url: 'https://api.spotify.com/v1/artists/'+response.artists[0].uri.substr(15,)+'',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + access_token				
					},
					success: function(response) {
						console.log(response);
						var find = 0 ;
						var artistGenres = response.genres.join().replace(new RegExp(",", 'g'), " ").split(" ");
						for(var i=0; i<artistGenres.length; i++)
						{
							if(placeGenres.join().indexOf(artistGenres[i]) != -1 ){
								console.log(artistGenres[i]);
								find=1;
								break;
							}	
						}
						if(find == 1){
							$.ajax({
								method: "POST",
								url: 'https://api.spotify.com/v1/playlists/'+playlistID+'/tracks?uris='+contextURI ,
								headers: {
									'Accept': 'application/json',
									'Content-Type': 'application/json',
									'Authorization': 'Bearer ' + access_token					
								},
								success: function(response) {
									console.log(response);
									document.getElementById("playlistTable").innerHTML+=songInfo;
									console.log(songReturn);
									$.ajax({
											type: 'GET',
											url: 'database.php?func=addPlaylist&userID='+userID+'&uri='+songReturn.uri+'&name='+songReturn.name+'&singer='+songReturn.artists[0].name+'&url='+songReturn.album.images[2].url+'&duration='+songReturn.duration_ms+'',
											crossDomain: true,
											success: function(data){
												console.log(data);
											}
									});
                                    	var rows = document.getElementById("playlistTable").rows;
						    
							for (var i = 0; i < rows.length; i++) {
						  		if(i % 4 == 0 || i % 4 == 1)
						  			rows[i].className = "odd_tr"
						  		else
						  			rows[i].className = "even_tr"
							}
								}
							});
						}
						else{			
							if (confirm("Song is inapropriate for Genres. Do you want to add it anyway ?")) {
								$.ajax({
									method: "POST",
									url: 'https://api.spotify.com/v1/playlists/'+playlistID+'/tracks?uris='+contextURI ,
									headers: {
										'Accept': 'application/json',
										'Content-Type': 'application/json',
										'Authorization': 'Bearer ' + access_token									
									},
									success: function(response) {
										console.log(response);
										document.getElementById("playlistTable").innerHTML+=songInfo;
										console.log(songReturn);
										$.ajax({
											type: 'GET',
											url: 'database.php?func=addPlaylist&userID='+userID+'&uri='+songReturn.uri+'&name='+songReturn.name+'&singer='+songReturn.artists[0].name+'&url='+songReturn.album.images[2].url+'&duration='+songReturn.duration_ms+'',
											crossDomain: true,
											success: function(data){
												console.log(data);
											}
										});
                                        	var rows = document.getElementById("playlistTable").rows;
						    
							for (var i = 0; i < rows.length; i++) {
						  		if(i % 4 == 0 || i % 4 == 1)
						  			rows[i].className = "odd_tr"
						  		else
						  			rows[i].className = "even_tr"
							}
									}
								});
							} 

						}
					}
				});
			}
		});
	}
	
	function removeTrack(trackURI)
	{

		$.ajax({
				method: 'DELETE',
                url: 'https://api.spotify.com/v1/playlists/'+playlistID+'/tracks',
				data: JSON.stringify({
					'tracks' : [{'uri': trackURI}]
				}),
				headers: {
                  'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
					console.log(response);
					$.ajax({
						type: 'GET',
						url: 'database.php?func=deletePlaylist&userID='+userID+'&uri='+trackURI+'',
						crossDomain: true,
						success: function(data){
						console.log(data);
						}
					});
					printPlaylist();
                }
            });
		
	}
	
	function getQueue(){
		console.log("queue");
		$.ajax({
			type: 'GET',
			url: 'database.php?func=getQueue&userID='+userID+'',
			crossDomain: true,
			success: function(data){
				queueList=[];
				var index = data.indexOf("</tr>");
				while(index!=-1){
				var str=data.substr(0,index);
				var i1,i2,i3,i4,i5;
				i1=str.indexOf("<uri:>")+6;
				i2=str.indexOf("<name:>")+7;
				i3=str.indexOf("<singer:>")+9;
				i4=str.indexOf("<duration:>")+11;
				i5=str.indexOf("<imagePath:>")+12;
				var song = {imagePath:str.substr(i5,str.indexOf("<premium:>")-i5) , name: str.substr(i2,i3-i2-9), singer: str.substr(i3,i4-i3-11), duration: str.substr(i4,i5-i4-12) , uri: str.substr(i1,i2-i1-7),premium:str.substr(str.indexOf("<premium:>")+10,1) ,vote: str.substr(str.indexOf("<vote:>")+7,) };
				queueList.push(song);
				if(song.premium == 1)
					song.vote=99999;
				sortPrintQueue();
				data=data.substr(index+5,);
				index = data.indexOf("</tr>");
				}
			}
		});	
	}
	function sortPrintQueue()
	{
        var x = 0;
		queueList.sort(function(a, b){return b.vote - a.vote});
		document.getElementById("queueTable").innerHTML="";
		for(var i=0; i<queueList.length; i++){
            x = x+1;
		var song = queueList[i];
		inText= "<tr><td class='td_img' rowspan='2' style='padding:10px' ><img src="+song.imagePath+"></img></td><td>"+song.name+"</td><td rowspan='2' class='span4 text-right'><button class='removeButton' type='button' onClick=removeQueue('"+song.uri+"')><i class='fa fa-times fa-2x' style = 'color: white;'></i></button></td></tr><tr><td>"+song.singer+"</td></tr>";
        
		document.getElementById("queueTable").innerHTML+= inText;
          
        }
                  	var rows = document.getElementById("queueTable").rows;
						    
							for (var i = 0; i < rows.length; i++) {
						  		if(i % 4 == 0 || i % 4 == 1)
						  			rows[i].className = "odd_tr"
						  		else
						  			rows[i].className = "even_tr"
							}
	}
	
	function addQueue(uri)
	{
		$.ajax({
			method:'GET',
            url: 'https://api.spotify.com/v1/tracks/'+uri.substr(14,)+'',
            headers: {
				'Authorization': 'Bearer ' + access_token
			},
            success: function(response) {
			console.log(response);
				var song = {imagePath: response.album.images[2].url, name: response.name, singer: response.artists[0].name, duration: response.duration_ms , uri: response.uri };
				queueList.push(song);
				var inText="";
				$.ajax({
					type: 'GET',
					url: 'database.php?func=addQueue&uri='+song.uri+'&name='+song.name+'&singer='+song.singer+'&duration='+song.duration+'&imagePath='+song.imagePath+'&userID='+userID+'',
					crossDomain: true,
					success: function(data){
						console.log(data);
						inText="<tr><td><img src="+song.imagePath+"></img></td><td>"+song.name+"</td><td>"+song.singer+"</td><td><button class='removeButton' type='button' onClick=removeQueue('"+song.uri+"')>-</button></td></tr>";
						document.getElementById("queueTable").innerHTML+=inText;
					}
				});	
			}
		});
	}
	
	function removeQueue(tempUri)
	{

		var i; 
		var songIndex;
		for (i=0; i<queueList.length; i++){
			if(queueList[i].uri==tempUri){
				songIndex=i;
			}		
		}
		if(!tempUri)
			songIndex=0;
		
		console.log(songIndex);
		var song= queueList[songIndex];
		var uri=song.uri;
		var imagePath= song.imagePath;
		$.ajax({
				type: 'GET',
				url: 'database.php?func=removeQueue&uri='+uri+'&userID='+userID+'',
				crossDomain: true,
				success: function(data){
					console.log(data);
					queueList.splice(songIndex,1);
					var str = document.getElementById("queueTable").innerHTML;
					var index = str.indexOf(imagePath);
					var index2 = str.indexOf("</tr>",index);
					document.getElementById("queueTable").innerHTML= str.substr(0,index-18)+str.substr(index2+5,);
					if(!tempUri){
						if(queueList.length > 0)
						playSong();
						else{
						pauseSong(-1);
						}
					}
				}
		});
	}
	
	function clearQueue()
	{
		$.ajax({
				type: 'GET',
				url: 'database.php?func=clearQueue&userID='+userID+'',
				crossDomain: true,
				success: function(data){
					console.log(data);
					queueList=[];
					getQueue();
				}
		});
		
	}
		
	function createPlaylist(name)
	{
			$.ajax({
				method: "POST",
                url: 'https://api.spotify.com/v1/users/'+userID+'/playlists',
				data: JSON.stringify({
					name: name , public: true
				}),
				headers: {
					'Authorization': 'Bearer ' + access_token,
					'Content-Type': 'application/json'
				},
				success: function(response) {
					console.log(response);
					showPlaylist(userID);
					createQueueList(userID);
					createRecommendationList(userID);
					createPlace(userID);
					createPlaylistList(userID);
					}
				});
	}
	

	function searchPlaylist(str)
	{	
		var j; 
		for( j=0 ; j<(trackCount/100); j++){
			console.log("search");
			var offset = (j*100);
			var inText=" ";
			$.ajax({
				method:'GET',
                url: 'https://api.spotify.com/v1/playlists/'+playlistID+'/tracks?offset='+offset+'',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
				success: function(response) {
					console.log(response);
					var i;
					for (i = 0; i < response.items.length; i++) { 
						var trackName = response.items[i].track.name;
						var singerName  = response.items[i].track.artists[0].name;
						if(trackName.toLowerCase().indexOf(str.toLowerCase()) != -1 || singerName.toLowerCase().indexOf(str.toLowerCase()) != -1){
							inText+="<tr><td class='td_img' rowspan='2'><img src="+response.items[i].track.album.images[2].url+"></img></td><td>"+response.items[i].track.name+"</td><td rowspan='2' class='span4 text-right'><button class='removeButton' title='Remove' type='button' onClick=removeTrack('"+response.items[i].track.uri+"')><i class='fa fa-times fa-2x' style = 'color: white;'></i></button><button class='queueButton' title='Add to Queue' type='button' onClick=addQueue('"+response.items[i].track.uri+"')><i class='fa fa-plus-circle fa-2x' style = 'color: white;'></i></button></td></tr><tr><td>"+response.items[i].track.artists[0].name+"</td></tr>";
						}
					}
					document.getElementById("playlistTable").innerHTML=inText;
					var rows = document.getElementById("playlistTable").rows;
						    
					for (var i = 0; i < rows.length; i++) {
				  		if(i % 4 == 0 || i % 4 == 1)
				  			rows[i].className = "odd_tr"
				  		else
				  			rows[i].className = "even_tr"
					}
				}
			});
		}
		
	}
	
	function addPlaylist(uri)
	{
		console.log(uri);
		var find = 0; 
		var j; 
		for( j=0 ; j<(trackCount/100); j++){
			var offset = (j*100);
			var inText=" ";
			$.ajax({
				method:'GET',
				async: false,
                url: 'https://api.spotify.com/v1/playlists/'+playlistID+'/tracks?offset='+offset+'',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
				success: function(response) {
					console.log(response);
					var i;
					for (i = 0; i < response.items.length; i++) { 
						if(response.items[i].track.uri.indexOf(uri) !=-1 ){
						find=1;
						console.log("find");
						break;
						}
					}
				}
			});
			if(find == 1 )
				break;
		}
		if(find==0){
			addTrack(uri);
			console.log(find);
		}
		else
			alert("Song is already in Playlist");
	}