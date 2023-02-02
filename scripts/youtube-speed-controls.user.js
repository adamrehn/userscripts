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
	// Keep track of whether we have completed setup
	let setupDone = false;
	
	function performSetup()
	{
		// Don't perform setup more than once
		if (setupDone === true) {
			return;
		}
		
		// Retrieve the video playback element and exit early if it can't be found (since this typically indicates that it hasn't loaded yet)
		let videoPlayer = document.getElementsByTagName("video")[0];
		if (videoPlayer === null || videoPlayer === undefined) {
			return;
		}
		
		// Create an overlay for displaying playback speed updates
		let overlay = $(document.createElement('div'));
		overlay.css('z-index', '9999999');
		overlay.css('position', 'absolute');
		overlay.css('left', '2rem');
		overlay.css('top', '2rem');
		overlay.css('padding', '2rem');
		overlay.css('font-size', '2rem');
		overlay.css('border-radius', '1rem');
		overlay.css('background', 'rgba(0,0,0,0.5)');
		overlay.css('color', '#fff');
		overlay.hide();
		$(videoPlayer.parentNode).append(overlay);
		
		// Sets the playback speed for the video
		let lastTimeout = null;
		function setPlaybackSpeed(speed)
		{
			// Update the playback speed
			videoPlayer.playbackRate = speed;
			
			// If the overlay is already visible then remove the pending timeout to hide it
			if (lastTimeout !== null) {
				clearTimeout(lastTimeout);
			}
			
			// Display the overlay for 1.5 seconds
			overlay.text(`Set playback speed to ${speed}x`);
			overlay.show();
			lastTimeout = setTimeout(() => {
				overlay.hide();
				lastTimeout = null;
			},
			1500);
		}
		
		// Wire up our keyboard shortcuts to control playback speed
		document.addEventListener('keydown', (event) =>
		{
			// Don't intercept key combos such as Ctrl+0
			if (event.ctrlKey === true) {
				return true;
			}
			
			switch (event.key)
			{
				case '1':
					setPlaybackSpeed(1);
					break;
				
				case '2':
					setPlaybackSpeed(1.25);
					break;
				
				case '3':
					setPlaybackSpeed(1.5);
					break;
				
				case '4':
					setPlaybackSpeed(1.75);
					break;
				
				case '5':
					setPlaybackSpeed(2);
					break;
				
				case '6':
					setPlaybackSpeed(2.5);
					break;
				
				case '7':
					setPlaybackSpeed(3);
					break;
				
				case '8':
					setPlaybackSpeed(3.5);
					break;
				
				case '9':
					setPlaybackSpeed(4);
					break;
				
				case '0':
					setPlaybackSpeed(0.5);
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
		
		// Set the initial playback speed to 1.0
		setPlaybackSpeed(1);
		
		// Mark setup as complete
		setupDone = true;
	}
	
	// Wait for dynamic population of the page elements to complete before manipulating the DOM
	window.setTimeout(function()
	{
		let observer = new MutationObserver(function() { performSetup(); });
		observer.observe($('body').get(0), { childList: true, subtree: true });
		performSetup();
	}, 1000);
})();
