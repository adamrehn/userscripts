// ==UserScript==
// @name         Auto-Refresh GitLab Issues
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Add option to automatically refresh a GitLab issues list
// @author       Adam Rehn
// @match        https://gitlab.com/*/issues/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function()
{
	//Enables or disables automatic page refreshing
	function updateRefreshTimer()
	{
		//Determine if auto-refresh is enabled or disabled
		let enabled = $('#auto-refresh').is(':checked');
		if (enabled === true)
		{
			//Set a timeout to refresh the page after 5 minutes
			window._autoRefreshTimeout = window.setTimeout(
				() => { window.location.reload(); },
				5 * 60 * 1000
			);
		}
		else
		{
			//Clear any existing timeout
			window.clearTimeout(window._autoRefreshTimeout);
		}
	}
	
	//Create our checkbox to toggle automatic page refreshing
	let toggle = $(document.createElement('input'))
		.attr('type', 'checkbox')
		.attr('id', 'auto-refresh')
		.attr('checked', 'checked');
	
	//Create a label for our checkbox
	let label = $(document.createElement('label'))
		.attr('for', 'auto-refresh')
		.text('Automatically refresh')
		.css('font-size', '1rem')
		.css('margin-bottom', '0')
		.css('font-weight', '400');
	
	//Add the checkbox and label to the toolbar at the top of the page
	$('.issues-nav-controls').append(toggle, label);
	
	//Wire up the checkbox's event handler
	toggle.change(() => {
		updateRefreshTimer();
	});
	
	//Set the initial timeout
	updateRefreshTimer();
})();
