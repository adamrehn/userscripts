// ==UserScript==
// @name         Declutter YouTube
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Provides functionality to toggle the visibility of various YouTube page elements.
// @author       Adam Rehn
// @match        https://www.youtube.com/*
// @require      https://code.jquery.com/jquery-4.0.0.min.js
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
		button.css('margin-right', '1rem');
		button.css('padding', '1.25rem 2rem');
		button.css('text-transform', 'uppercase');
		button.text(label);
		return button;
	}
	
	// Keep track of whether we have completed setup
	let setupDone = false;
	
	function performSetup()
	{
		// Don't perform setup more than once
		if (setupDone === true) {
			return;
		}
		
		// Grab a reference to the comments section, related videos sidebar, end screen related videos, and the top button row,
		// and exit early if any of these elements can't be found (since this typically indicates that they haven't loaded yet)
		let comments = $('#comments');
		let related = $('#related');
		let endScreen = $('.ytp-endscreen-content');
		let topRow = $('#above-the-fold #top-row');
		if (comments.get(0) === undefined || related.get(0) === undefined || topRow.get(0) === undefined) {
			return;
		}
		
		// Hide the page elements by default
		comments.hide();
		related.hide();
		endScreen.hide();
		
		// Create a button to toggle the visibility of the comments section
		let commentsToggle = createButton('Toggle comments');
		commentsToggle.click(function() {
			comments.toggle();
		});
		
		// Create a button to toggle the visibility of the related videos (both the sidebar and the end screen)
		let relatedToggle = createButton('Toggle related');
		relatedToggle.click(function()
		{
			related.toggle();
			endScreen.toggle();
		});
		
		// Create a flex container to wrap the toggle buttons
		let buttonWrapper = $(document.createElement('div'));
		buttonWrapper.append(commentsToggle, relatedToggle);
		buttonWrapper.css('display', 'flex');
		buttonWrapper.css('flex-direction', 'row');
		buttonWrapper.css('justify-content', 'flex-start');
		buttonWrapper.css('padding', '1rem 0');
		
		// Inject the toggle buttons below the top row of buttons
		$('#above-the-fold #bottom-row').before(buttonWrapper);
		
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
