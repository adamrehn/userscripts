// ==UserScript==
// @name         Hide Watched YouTube Videos
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Provides functionality to hide watched videos on the YouTube subscriptions page.
// @author       Adam Rehn
// @match        https://www.youtube.com/feed/subscriptions
// @require      https://code.jquery.com/jquery-3.6.3.min.js
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
	
	function createCheckbox(text)
	{
		let label = $(document.createElement('label')).css('padding', '1rem').css('margin-right', '4rem');
		let checkbox = $(document.createElement('input')).attr('type', 'checkbox').attr('checked', 'checked');
		label.append(checkbox);
		label.append(document.createTextNode(' ' + text));
		return checkbox;
	}
	
	function createDropdown(options, selected)
	{
		let dropdown = $(document.createElement('select'));
		
		for (const option of options)
		{
			let optionElement = $(document.createElement('option')).attr('value', option['value']).text(option['label']);
			if (option['value'] == selected) {
				optionElement.attr('selected', 'selected');
			}
			
			dropdown.append(optionElement);
		}
		
		return dropdown;
	}
	
	// Traverses the DOM (including the Shadow DOM) to find the first ancestor element that matches the specified selector
	function findFirstAncestor(elem, selector)
	{
		let ancestor = elem;
		while (ancestor !== null)
		{
			// Traverse up the DOM, switching to the real DOM element when we locate a ShadowRoot
			if (ancestor.parentNode == null && ancestor.host !== undefined) {
				ancestor = ancestor.host;
			}
			else {
				ancestor = ancestor.parentNode;
			}
			
			// Determine whether the current element matches the specified selector
			if (ancestor !== null && ancestor.matches !== undefined && ancestor.matches(selector)) {
				return ancestor;
			}
		}
		
		return null;
	}
	
	// Alternative to jQuery.parents() that handles the Shadow DOM correctly
	function findAncestors(elems, selector)
	{
		let ancestors = [];
		
		for (let elem of elems.get())
		{
			let parent = findFirstAncestor(elem, selector);
			if (parent !== null) {
				ancestors.push(parent);
			}
		}
		
		return $(ancestors);
	}
	
	// Keep track of whether we have completed setup
	let setupDone = false;
	let setupObserver = null;
	
	function performSetup()
	{
		// Don't perform setup more than once
		if (setupDone === true) {
			return;
		}
		
		// Exit early if the #primary element can't be found (which indicates that it hasn't loaded yet)
		if ($('#primary').length == 0) {
			return;
		}
		
		// Disable the top-level MutationObserver that is used to trigger the setup function
		setupObserver.disconnect();
		
		// Create a wrapper <p> to hold our controls
		let wrapper = $(document.createElement('p'))
			.css('text-align', 'center')
			.css('font-size', '1.5rem')
			.css('padding', '2rem 0')
			.css('border-bottom', '1px solid rgba(0, 0, 0, 0.1)');
		
		// Create a checkbox to toggle the visibility of watched videos
		let toggleHideWatched = createCheckbox('Hide watched videos');
		wrapper.append(toggleHideWatched.parent());
		
		// Create a checkbox to toggle the visibility of YouTube Shorts
		let toggleHideShorts = createCheckbox('Hide Shorts');
		wrapper.append(toggleHideShorts.parent());
		
		// Create a checkbox to toggle the visibility of old videos
		let toggleHideOld = createCheckbox('Hide videos older than or equal to:');
		toggleHideOld.parent().css('margin-right', '0');
		wrapper.append(toggleHideOld.parent());
		
		// Create a dropdown to select the age threshold for hiding old videos
		let ageThresholdDropdown = createDropdown(
			[
				{'value': '1', 'label': '1 month'},
				{'value': '2', 'label': '2 months'},
				{'value': '3', 'label': '3 months'},
				{'value': '4', 'label': '4 months'},
				{'value': '5', 'label': '5 months'},
				{'value': '6', 'label': '6 months'},
				{'value': '7', 'label': '7 months'},
				{'value': '8', 'label': '8 months'},
				{'value': '9', 'label': '9 months'},
				{'value': '10', 'label': '10 months'},
				{'value': '11', 'label': '11 months'},
				{'value': '12', 'label': '12 months'}
			],
			'6'
		);
		ageThresholdDropdown.css('margin-right', '5rem');
		wrapper.append(ageThresholdDropdown);
		
		// Create a button that links to the page for managing YouTube watch history
		let link = $(document.createElement('a')).attr('target', '_blank').attr('href', 'https://myactivity.google.com/u/1/activitycontrols/youtube?utm_source=my-activity');
		let button = createButton('Manage Watch History');
		link.append(button);
		wrapper.append(link);
		
		// Updates the visibility of videos based on which checkboxes are checked
		function updateVisibility()
		{
			// Make all videos visible that had previously been hidden based on age (this ensures videos reappear when changing the threshold value in the dropdown)
			$('ytd-rich-item-renderer').css('visibility', 'visible');
			
			// Determine whether we are hiding old videos
			if (toggleHideOld.is(':checked'))
			{
				// Identify all of the videos that are older than the threshold selected in the dropdown
				let firstOldVideo = -1;
				let threshold = parseInt($('option:selected', ageThresholdDropdown).val());
				let old = findAncestors($("ytd-rich-item-renderer ytd-video-meta-block span.inline-metadata-item").filter(function(index, element)
				{
					// Once we have found one video that meets the age threshold, the reverse chronological order guarantees that all subsequent videos will be older
					if (firstOldVideo != -1 && index > firstOldVideo) {
						return true;
					}
					
					// Verify that this metadata line contains the video age
					// (Note: we used to use a `:contains('ago')` suffix in the element selector above, but programmatic text matching appears to be more reliable)
					let text = $(element).text();
					if (text.indexOf('ago') == -1) {
						return false;
					}
					
					// Attempt to extract the age of the video
					let ageComponents = text.replace('Streamed ', '').replace(' ago', '').split(' ');
					if (ageComponents.length != 2) {
						return false;
					}
					
					// Parse the age value and determine whether it meets the threshold
					// (Note that if the threshold is 12 months then the check for a unit of "year" is actually what gets triggered, rather than the month value)
					let units = ageComponents[1].replace('s', '');
					let value = parseInt(ageComponents[0]);
					if (units == "year" || (units == "month" && !isNaN(value) && value >= threshold))
					{
						firstOldVideo = index;
						return true;
					}
					else {
						return false;
					}
					
				}), 'ytd-rich-item-renderer');
				
				// Hide the identified videos
				// (Note that we set them to invisible but do not take them out of the document layout, in order to prevent excessive repeated loading of old videos)
				old.css('visibility', 'hidden');
			}
			
			// Identify all of the videos that have already been watched
			let watched = findAncestors($('ytd-thumbnail-overlay-resume-playback-renderer'), 'ytd-rich-item-renderer');
			
			// Determine whether we are hiding watched videos
			if (toggleHideWatched.is(':checked')) {
				watched.hide();
			}
			else {
				watched.show();
			}
			
			// Identify all YouTube Shorts
			let shorts = findAncestors($('h2 yt-icon svg'), 'ytd-rich-section-renderer');
			
			// Determine whether we are hiding YouTube Shorts
			if (toggleHideShorts.is(':checked')) {
				shorts.hide();
			}
			else {
				shorts.show();
			}
			
		}
		
		// Wire up the event handler for the checkboxes and the dropdown
		for (let element of [toggleHideWatched, toggleHideShorts, toggleHideOld, ageThresholdDropdown])
		{
			element.change(function() {
				updateVisibility();
			});
		}
		
		// Update the visibility of watched videos whenever new video thumbnails are loaded
		let videoObserver = new MutationObserver(function() { updateVisibility(); });
		videoObserver.observe($('#primary').get(0), { childList: true, subtree: true });
		
		// Inject the controls at the top of the page
		$('#primary').prepend(wrapper);
		
		// Set the initial video visibility
		updateVisibility();
		
		// Mark setup as complete
		setupDone = true;
	}
	
	// Wait for dynamic population of the page elements to complete before manipulating the DOM
	window.setTimeout(function()
	{
		setupObserver = new MutationObserver(function() { performSetup(); });
		setupObserver.observe($('body').get(0), { childList: true, subtree: true });
		performSetup();
	}, 1000);
	
})();
