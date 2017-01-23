jQuery(function($) {

	var clientId = "7fhzyovpn39lo6ab7wpdfovxiqovbf";

	var init = function() {
		injectStyleSheet("darklybootswatch.min.css");
		injectStyleSheet("extension.css");
		injectStyleSheet("animate.css");
		checkLocalStorage();
		setupTwitch();
		setupGetTwitchName();
	}

	var injectStyleSheet = function(name) {
		var style = document.createElement('link');
		style.rel = 'stylesheet';
		style.type = 'text/css';
		style.href = chrome.extension.getURL(name);
		(document.head || document.documentElement).appendChild(style);
	}

	var checkLocalStorage = function() {
		var userName = localStorage.getItem("userName");
		if (userName != null) {
			populateUserFollows(userName);
			$('#inputSuccess').val(userName)
		}
	}

	// var getAuthToken = function() {

	// 	clientInfo = "[]";
	// 	var oAuthUrl = 'https://api.twitch.tv/kraken/oauth2/token';

	// 	$.ajax({
	// 		type: "POST",
	// 		url: oAuthUrl,
	// 		headers: {
	// 			'Client-ID': clientId
	// 		},
	// 		success: function(data) {
	// 			console.log(data);
	// 		},
	// 		failure: function(errMsg) {
	// 			console.log(errMsg);
	// 		}
	// 	});
	// }

	var updateChannels = function(data) {
		$('#follows a').remove();
		$(data.follows).each(function() {
			$('#follows').append('<a class="list-group-item" href="https://twitch.tv/' + this.channel.name + '" target="_blank">' + 
				'<span class="circle"></span>' +
				'<span class="channel-name">' + this.channel.name + '</span>' +
				'</a>');
		})
	}

	var populateUserFollows = function(name) {
		var data = "";
		var userName = name;

		if (userName == null) {
			userName = $('#inputSuccess').val()
			localStorage.setItem("userName", userName);
		}

		var followsUrl = 'https://api.twitch.tv/kraken/users/' + userName + '/follows/channels'

		$.ajax({
			type: "GET",
			url: followsUrl,
			headers: {
				'client-id': clientId
			},
			success: function(data) {
				data = eval(data);
				//console.log(data);
				updateChannels(data);
				getOnlineFollowsInfo();
			},
			failure: function(errMsg) {
				alert(errMsg);
			}
		})
	}

	var getOnlineFollowsInfo = function() {
		$('#follows a').each(function() {
			var followName = $(this).text()
			var followStreamInfoUrl = 'https://api.twitch.tv/kraken/streams/' + followName;
			$.ajax({
				type: "GET",
				url: followStreamInfoUrl,
				headers: {
					'client-id': clientId
				},
				success: function(data) {
					data = eval(data);
					//console.log(data);
					populateOnlineStatus(data);
				},
				failure: function(errMsg) {
					alert(errMsg);
				}
			})
		})
	}

	var populateOnlineStatus = function(streamData) {
		if (streamData.stream != null) {
			var streamName = streamData.stream.channel.name;
			$('.list-group-item[href="https://twitch.tv/' + streamName + '"]').find('.circle').css('background', 'green').addClass("animated bounce");
		}
	}

	var setupGetTwitchName = function() {
		$('.twitch-name').on('keyup', function() {
			populateUserFollows();
		})
	}

	var setupTwitch = function() {
		Twitch.init({
			clientId: clientId
		}, function(error, status) {
			console.log(error);
			console.log(status);
			if (status.authenticated) {
				alert()
					// Already logged in, hide button
				$('.twitch-connect').hide()
			}
		});
	}

	init();
});