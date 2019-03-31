	var player;
	var started=0;
	var devID="";
	window.onSpotifyWebPlaybackSDKReady = () => {
    player = new Spotify.Player({
		name: 'Orchestrion Player',
		getOAuthToken: cb => { cb(access_token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { controlState(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
		console.log('Ready with Device ID', device_id);
		devID=device_id;
		activateWebPlayer();
		
	});

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
		console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
	console.log('player.is_active');
    player.connect();
	
	  
    };

	function controlState(state)
	{
		if(state.paused != lastState){
			lastState=state.paused;
		console.log(state);
		if(state.paused){
			if(state.position > 0 && state.position < state.duration ){
			console.log("paused");}
			else{
			console.log("nextsong");
			if(started==1)
				nextSong();
		}}}
	}
	
	function nextSong()
	{
			paused=-1;
			removeQueue();
	}
	
	function activateWebPlayer(){
			console.log("webPlayerActivated");
			$.ajax({
				method: 'PUT',
                url: 'https://api.spotify.com/v1/me/player',
				data: JSON.stringify({
					'device_ids' : [devID]
				}),
				headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
					console.log(response);
					player.pause();
					
                }
            });
	}
	
	function playSong()
	{
		started=1;
		switch(paused) {
		  case 0:
			pauseSong(1);
			break;
		  case 1:
			$.ajax({
				method: 'PUT',
                url: 'https://api.spotify.com/v1/me/player/play',
				headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
					console.log(response);
					paused=0;
					document.getElementById("playerPlay").innerHTML='<i class = "fa fa-pause" style = "color: white;"></i>';
                }
            });
			break;
		  case -1:
			if(queueList.length>0){
			var contextURI = queueList[0].uri;
			$.ajax({
				method: 'PUT',
                url: 'https://api.spotify.com/v1/me/player/play',
				data: JSON.stringify({
					'uris' : [contextURI]
				}),
				headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
					console.log(response);
					paused=0;
					document.getElementById("playerPlay").innerHTML='<i class = "fa fa-pause" style = "color: white;"></i>';
					getLyrics(queueList[0].name,queueList[0].singer);
                }
            });}
			break;
		}
	}
	function pauseSong(control)
	{
		$.ajax({
			method: "PUT",
            url: 'https://api.spotify.com/v1/me/player/pause',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + access_token
				
			},
			success: function(response) {
				paused=control;
				document.getElementById("playerPlay").innerHTML='<i class = "fa fa-play" style = "color: white;"></i>';
				}
			});
	}
	
	var slider = document.getElementById("volume");

		slider.oninput = function() {
			changeVolume(this.value);
		  console.log( this.value);
		  }


	
	function changeVolume(vol)
	{
		console.log("changeVol");
		$.ajax({
			method: "PUT",
            url: 'https://api.spotify.com/v1/me/player/volume?volume_percent='+vol,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + access_token
				
			},
			success: function(response) {
				console.log(response);
				}
			});
		
	}
	
	function getPlayerInf()
	{
		$.ajax({
			method: "GET",
            url: 'https://api.spotify.com/v1/me/player',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + access_token
				
			},
			success: function(response) {
				console.log(response);
				}
			});
	}