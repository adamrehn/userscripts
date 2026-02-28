// ==UserScript==
// @name         Centre-Align IETF Drafts and RFCs
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Removes left-alignment of IETF Drafts and RFCs at large resolutions.
// @author       Adam Rehn
// @match        https://tools.ietf.org/html/*
// @match        https://datatracker.ietf.org/*
// @require      https://code.jquery.com/jquery-4.0.0.min.js
// ==/UserScript==

(function()
{
	//Apply the same margin value that the page already uses on smaller resolutions (e.g. mobile devices)
	$('.content').css('margin', '0 auto');
})();
