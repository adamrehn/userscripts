// ==UserScript==
// @name         Enhanced YouTube Speed Controls
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Provides additional playback speed controls for YouTube, including keyboard shortcuts.
// @author       Adam Rehn
// @match        https://www.youtube.com/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function()
{
	// Retrieve the video playback element and exit early if it can't be found
	let videoPlayer = document.getElementsByTagName("video")[0];
	if (videoPlayer === null || videoPlayer === undefined) {
		return;
	}
	
	// Create an overlay for displaying playback speed updates
	let overlay = $(document.createElement('div'));
	overlay.css('position', 'absolute');
	overlay.css('left', '2rem');
	overlay.css('top', '2rem');
	overlay.css('padding', '2rem');
	overlay.css('font-size', '2rem');
	overlay.css('border-radius', '1rem');
	overlay.css('background', 'rgba(0,0,0,0.5)');
	overlay.css('color', '#fff');
	overlay.hide();
	$('#player-container').append(overlay);
	
	// Sets the playback speed for the video
	function setPlaybackSpeed(speed)
	{
		// Update the playback speed
		videoPlayer.playbackRate = speed;
		
		// Display the overlay for 1.5 seconds
		overlay.text(`Set playback speed to ${speed}x`);
		overlay.show();
		setTimeout(() => { overlay.hide(); }, 1500);
	}
	
	// Wire up our keyboard shortcuts to control playback speed
	document.addEventListener('keydown', (event) =>
	{
		switch (event.key)
		{
			case '1':
				setPlaybackSpeed(1);
				break;
			
			case '2':
				setPlaybackSpeed(2);
				break;
			
			case '3':
				setPlaybackSpeed(3);
				break;
			
			case '4':
				setPlaybackSpeed(4);
				break;
			
			default:
				// Don't interfere with any other keys
				return true;
		}
		
		// Prevent any default behaviour for our shortcut keys
		event.stopPropagation();
		event.preventDefault();
		return false;
	},
	{capture: true});
})();
