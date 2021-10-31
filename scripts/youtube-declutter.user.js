// ==UserScript==
// @name         Declutter YouTube
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Provides functionality to toggle the visibility of various YouTube page elements.
// @author       Adam Rehn
// @match        https://www.youtube.com/*
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
		button.css('margin-left', '1rem');
		button.css('padding', '0.25rem 1.5rem');
		button.css('text-transform', 'uppercase');
		button.text(label);
		return button;
	}
	
	function setup()
	{
		// Grab a reference to the comments section and related videos sidebar
		let comments = $('#comments');
		let related = $('#related');
		
		// Hide both page elements by default
		comments.hide();
		related.hide();
		
		// Create a button to toggle the visibility of the comments section
		let commentsToggle = createButton('Toggle comments');
		commentsToggle.click(function() {
			comments.toggle();
		});
		
		// Create a button to toggle the visibility of the related videos sidebar
		let relatedToggle = createButton('Toggle related');
		relatedToggle.click(function() {
			related.toggle();
		});
		
		// Inject both toggle buttons immediately to the right of the subscribe/subscribed button
		$('#subscribe-button ytd-subscribe-button-renderer').append(commentsToggle, relatedToggle);
	}
	
	// Wait for dynamic population of the page elements to complete before manipulating the DOM
	window.setTimeout(setup, 1000);
})();
