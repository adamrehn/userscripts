// ==UserScript==
// @name         Hide StackExchange Questions
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Provides functionality to toggle the visibility of related questions and "Hot Network Questions" on StackExchange websites.
// @author       Adam Rehn
// @match        https://*.stackexchange.com/questions/*
// @match        https://askubuntu.com/questions/*
// @match        https://serverfault.com/questions/*
// @match        https://stackoverflow.com/questions/*
// @match        https://superuser.com/questions/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function()
{
	function createButton(label)
	{
		let button = $(document.createElement('button'));
		button.css('background-color', 'rgb(225, 236, 244)');
		button.css('border', '1px solid rgb(122, 167, 199)');
		button.css('border-radius', '2px');
		button.css('color', 'rgb(57, 115, 157)');
		button.css('cursor', 'pointer');
		button.css('display', 'inline-block');
		button.css('font-size', '1rem');
		button.css('margin-bottom', '1.5rem');
		button.css('padding', '0.5rem 1.5rem');
		button.text(label);
		return button;
	}
	
	// Grab a reference to the lists for the related questions and "Hot Network Questions"
	$relatedQuestions = $('.sidebar-related > .related');
	$networkQuestions = $('#hot-network-questions > ul');
	$moreQuestions = $('#hot-network-questions > a.show-more');
	
	// Create a button to toggle the visibility of related questions
	$toggleRelated = createButton('Toggle related questions');
	$relatedQuestions.before($toggleRelated);
	$toggleRelated.click(function() {
		$relatedQuestions.toggle();
	});
	
	// Create a button to toggle the visibility of "Hot Network Questions"
	$toggleNetwork = createButton('Toggle hot network questions');
	$networkQuestions.before($toggleNetwork);
	$toggleNetwork.click(function()
	{
		$networkQuestions.toggle();
		$moreQuestions.toggle();
	});
	
	// Hide the questions by default
	$toggleRelated.trigger('click');
	$toggleNetwork.trigger('click');
})();
