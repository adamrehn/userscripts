// ==UserScript==
// @name         Unread link for Gmail
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Adds an "Unread" link to Gmail's navigation menu.
// @author       Adam Rehn
// @match        https://mail.google.com/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function()
{
	window.setTimeout(function()
	{
		// Attempt to locate the navigation items for "Inbox" and "Important"
		var inboxLabel = $('div[data-tooltip="Inbox"]');
		var importantLabel = $('div[data-tooltip="Important"]');
		if (inboxLabel.length == 1)
		{
			// Create a new navigation item for "Unread", using the "Important" item as a template
			var template = importantLabel.parent();
			var unreadLabel = $(document.createElement('div'));
			unreadLabel.html(template.html());
			unreadLabel.removeAttr('id');
			
			// Set the tooltip for the new item
			var tooltip = $('div[data-tooltip="Important"]', unreadLabel);
			tooltip.attr('data-tooltip', 'Unread');
			tooltip.removeAttr('id');
			
			// Set the hyperlink and label for the new item
			var unreadLink = $('a', unreadLabel);
			unreadLink.attr('href', 'https://mail.google.com/mail/u/0/#search/is%3Aunread');
			unreadLink.attr('aria-label', 'Unread');
			unreadLink.text('Unread');
			
			// Navigate to the hyperlink when the item is clicked
			unreadLabel.click(function() {
				window.location.assign(unreadLink.attr('href'));
			});
			
			// Add the new item to the navigation list
			var menu = inboxLabel.parent();
			menu.prepend(unreadLabel);
		}
		
	// Wait 5 seconds for the navigation to load before modifying it
	// (Note that if we don't wait long enough, the page's own JS can overwrite our changes to the DOM)
	}, 5000);
})();
