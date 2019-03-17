	var access_token;
	var refresh_token;
	var code;
	var userID;
	var paused=-1;
	var playlist = [];
	var queueList=[];
	var lastState=false;
	var trackCount=0;
      (function() {
		code = window.location.search.substr(6,window.location.search.indexOf("&state")-6);
        var error;
		
        if (error) {
          alert('There was an error during the authentication');
        } else {
          if (code) {
				$.ajax({
					type: 'GET',
					url: 'database.php?func=getToken&code='+code+'',
					crossDomain: true,
					async: false,
					success: function(data){
						access_token=data.substr(0,data.indexOf("<refresh:>"));
						refresh_token=data.substr(data.indexOf("<refresh:>")+10,);
						history.pushState(null, null, '/orchestrion/');
					}
				});	
				
				$.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
				  document.getElementById("applicationInterface").style.display = 'block'; 
				  getLocation();
				  userID= response.id;
				  showPlaylist(userID);
				  getPlaceInfo();
				  queueList=[];
				  getQueue();
				  getRecommendation();
				  window.setInterval(getQueue, 60000);
				  window.setInterval(getRecommendation, 60000);
				  window.setInterval(refreshToken, 3500000);
				  document.getElementById("placeQR").innerHTML="<img style='position: absolute;left: 30px;bottom: 45px;' src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&amp;data="+userID+"'>";

				  
                }
            });
				
          } else {
              console.log("redirect");
			  //redirectTest();
          }
          
        }
      })();
	  
	function search(str)
	{
		var inText=" ";
		$.ajax({
			method: "GET",
            url: 'https://api.spotify.com/v1/search?q='+str+'&type=track&market=TR',
			headers: {
				'Authorization': 'Bearer ' + access_token,
				'Content-Type': 'application/json'
			},
			success: function(response) {
				console.log(response);
				for (i = 0; i < response.tracks.items.length; i++) { 
					inText+="<tr><td><img src="+response.tracks.items[i].album.images[2].url+"></img></td><td>"+response.tracks.items[i].name+"</td><td>"+response.tracks.items[i].artists[0].name+"</td><td>"+response.tracks.items[i].duration_ms+"</td><td><button type='button' onClick=addPlaylist('"+response.tracks.items[i].uri+"')>Add to Playlist</button></td></tr>";
					}
					document.getElementById("searchTable").innerHTML=inText;
				}
			});
	}
	
	function redirectTest(){
		window.location.replace("https://accounts.spotify.com/tr/login?continue=https:%2F%2Faccounts.spotify.com%2Fauthorize%3Fresponse_type%3Dcode%26client_id%3D5bce2587d4c84f61893f49bea6a1ae6d%26scope%3Duser-read-private%2520user-read-email%2520playlist-modify-public%2520playlist-modify-private%2520user-read-playback-state%2520user-modify-playback-state%2520streaming%2520app-remote-control%2520user-read-birthdate%26redirect_uri%3Dhttps://buraksibirlioglu.github.io/Orchestrion/%26state%3DFOkjsMAnY4Vnn0bY");
	}
	
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			console.log("Geolocation is not supported by this browser.");
		}
	}
	function showPosition(position) {
		console.log(position);
		$.ajax({
					type: 'GET',
					url: 'database.php?func=setCoordinates&lat='+position.coords.latitude+'&lon='+position.coords.longitude+'&userID='+userID+'',
					crossDomain: true,
					success: function(data){
						console.log(data);
						//document.getElementById("placeQR").innerHTML="<img style='position: absolute;left: 30px;bottom: 45px;' src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&amp;data="+userID+"'>";

					}
				});	
	}
	
	function getPlaceInfo()
	{
		$.ajax({
			type: 'GET',
			url: 'database.php?func=getPlaceInfo&userID='+userID+'',
			crossDomain: true,
			success: function(data){
				console.log(data);
				var output= data.substr(data.indexOf("<path:>")+7);
				document.getElementById("placePath").value= output;
				document.getElementById("previewing").src=output;
				data=data.substr(0,data.indexOf("<path:>"));
				output= data.substr(data.indexOf("<mail:>")+7);
				document.getElementById("placeMail").value= output;
				data=data.substr(0,data.indexOf("<mail:>"));
				output = data.substr(data.indexOf("<telephone>")+11);
				document.getElementById("placeTel").value= output;
				data=data.substr(0,data.indexOf("<telephone>"));
				output = data.substr(data.indexOf("<address:>")+10);
				document.getElementById("placeAddr").value= output;
				data=data.substr(0,data.indexOf("<address:>"));
				output = data.substr(data.indexOf("<information:>")+14);
				document.getElementById("placeInfo").value= output;
				data=data.substr(0,data.indexOf("<information:>"));
				output = data.substr(data.indexOf("<name:>")+7);
				document.getElementById("placeName").value= output;
				data=data.substr(0,data.indexOf("<name:>"));
				console.log(data);
			}
		});	
	}
	
	function updatePlaceInfo()
	{
			console.log("updated");
			document.getElementById("uploadButton").click();
			var name=document.getElementById("placeName").value;
			var info = document.getElementById("placeInfo").value;
			var addr = document.getElementById("placeAddr").value;
			var mail = document.getElementById("placeMail").value;
			var tel = document.getElementById("placeTel").value;
			var path = document.getElementById("placePath").value;
			$.ajax({
			type: 'GET',
			url: 'database.php?func=updatePlaceInfo&userID='+userID+'&name='+name+'&info='+info+'&addr='+addr+'&mail='+mail+'&tel='+tel+'&path='+path+'',
			crossDomain: true,
			success: function(data){
				alert("Updated");
				getPlaceInfo();
			
			}
		});	
		
	}
	
	function refreshToken()
	{
		$.ajax({
			type: 'GET',
			url: 'database.php?func=renewToken&token='+refresh_token+'',
			success: function(data){
				console.log(data);
				access_token=data;
			
			}
		});	
	}
	

	