// ==UserScript==
// @name         Hide Watched YouTube Videos
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Provides functionality to hide watched videos on the YouTube subscriptions page.
// @author       Adam Rehn
// @match        https://www.youtube.com/feed/subscriptions
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function()
{
	function setup()
	{
		// Create our checkbox to toggle the visibility of watched videos
		let wrapper = $(document.createElement('p')).css('text-align', 'center').css('font-size', '1.5rem').css('margin-top', '2rem');
		let label = $(document.createElement('label'));
		let toggle = $(document.createElement('input')).attr('type', 'checkbox').attr('checked', 'checked');
		label.append(toggle);
		label.append(document.createTextNode(' Hide watched'));
		wrapper.append(label);
		
		// Updates the visibility of watched videos based on whether the checkbox is checked
		function updateVisibility()
		{
			// Identify all of the videos that have already been watched
			let watched = $('ytd-grid-video-renderer #progress').parents('ytd-grid-video-renderer');
			
			// Hide or show the watched videos based on whether the checkbox is checked
			if (toggle.is(':checked')) {
				watched.hide();
			}
			else {
				watched.show();
			}
		}
		
		// Inject the checkbox at the top of the page
		$('#primary').prepend(wrapper);
		
		// Wire up the event handler for the checkbox
		toggle.change(function() {
			updateVisibility();
		});
		
		// Set the initial visibility of the watched videos
		updateVisibility();
	}
	
	// Wait for dynamic population of the page elements to complete before manipulating the DOM
	window.setTimeout(setup, 1000);
})();
