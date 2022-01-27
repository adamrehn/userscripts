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
	function createButton(label)
	{
		let button = $(document.createElement('button'));
		button.css('background-color', 'rgb(6, 95, 212)');
		button.css('border', '1px solid rgb(6, 95, 212)');
		button.css('border-radius', '2px');
		button.css('color', '#fff');
		button.css('cursor', 'pointer');
		button.css('font-family', 'Roboto');
		button.css('font-size', '1.4rem');
		button.css('font-weight', '500');
		button.css('padding', '1rem 3rem');
		button.css('text-transform', 'uppercase');
		button.text(label);
		return button;
	}
	
	function setup()
	{
		// Create a wrapper <p> to hold our controls
		let wrapper = $(document.createElement('p'))
			.css('text-align', 'center')
			.css('font-size', '1.5rem')
			.css('padding', '2rem 0')
			.css('border-bottom', '1px solid rgba(0, 0, 0, 0.1)');
		
		// Create our checkbox to toggle the visibility of watched videos
		let label = $(document.createElement('label')).css('padding', '1rem').css('margin-right', '4rem');
		let toggle = $(document.createElement('input')).attr('type', 'checkbox').attr('checked', 'checked');
		label.append(toggle);
		label.append(document.createTextNode(' Hide watched'));
		wrapper.append(label);
		
		// Create a button that links to the page for managing YouTube watch history
		let link = $(document.createElement('a')).attr('target', '_blank').attr('href', 'https://myactivity.google.com/u/1/activitycontrols/youtube?utm_source=my-activity');
		let button = createButton('Manage Watch History');
		link.append(button);
		wrapper.append(link);
		
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
		
		// Wire up the event handler for the checkbox
		toggle.change(function() {
			updateVisibility();
		});
		
		// Update the visibility of watched videos whenever new video thumbnails are loaded
		let observer = new MutationObserver(function() { updateVisibility(); });
		observer.observe($('#primary').get(0), { childList: true, subtree: true });
		
		// Inject the controls at the top of the page
		$('#primary').prepend(wrapper);
		
		// Set the initial visibility of the watched videos
		updateVisibility();
	}
	
	// Wait for dynamic population of the page elements to complete before manipulating the DOM
	window.setTimeout(setup, 1000);
})();
