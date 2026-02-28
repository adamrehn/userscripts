// ==UserScript==
// @name         Classic Theme for Gmail
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Modifies Gmail's theme colours to more closely resemble the old Gmail appearance.
// @author       Adam Rehn
// @match        https://mail.google.com/*
// @require      https://code.jquery.com/jquery-4.0.0.min.js
// ==/UserScript==

(function()
{
	var stylesheet = $(document.createElement('style')).attr('type', 'text/css');
	stylesheet.text(`
		
		.wl {
			background: transparent;
		}
		
		.gb_Se, form.aJf
		{
			background: #f1f3f4;
		}
		
		.yO {
			background: #f4f7f7;
		}
		
		.nH .qp .aJh::placeholder {
			color: #5e5e5e;
		}
		
	`);
	$('body').append(stylesheet);
})();
