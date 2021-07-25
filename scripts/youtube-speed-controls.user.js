// ==UserScript==
// @name         Enhanced YouTube Speed Controls
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Provides additional playback speed controls for YouTube, including keyboard shortcuts.
// @author       Adam Rehn
// @match        https://www.youtube.com/*
// ==/UserScript==

(function()
{
	// Retrieve the video playback element
	let videoPlayer = document.getElementsByTagName("video")[0];
	if (videoPlayer === null || videoPlayer === undefined) {
		return;
	}
	
	// Sets the playback speed for the video
	function setPlaybackSpeed(speed)
	{
		videoPlayer.playbackRate = speed;
		console.log(`Set playback speed to ${speed}x`);
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
