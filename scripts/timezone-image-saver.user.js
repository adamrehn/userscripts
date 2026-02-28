// ==UserScript==
// @name         Timezone Image Saver
// @namespace    https://adamrehn.com/
// @version      0.0.1
// @description  Save selected Time Zone Converter cities and times as images
// @author       Adam Rehn
// @match        https://www.timeanddate.com/worldclock/*
// @require      https://code.jquery.com/jquery-4.0.0.min.js
// @require      https://html2canvas.hertzen.com/dist/html2canvas.min.js
// ==/UserScript==

(function()
{
	//Adds bulk CSS styles to a set of elements
	function css(elems, styles)
	{
		for (elem of elems)
		{
			let updated = ((elem.hasAttribute('style')) ? elem.getAttribute('style') : '') + styles;
			elem.setAttribute('style', updated);
		}
	}
	
	//Triggers a download of data URI
	//(From here: <https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server>)
	function download(filename, dataUri)
	{
		var element = document.createElement('a');
		element.setAttribute('href', dataUri);
		element.setAttribute('download', filename);
		
		element.style.display = 'none';
		document.body.appendChild(element);
		
		element.click();
		
		document.body.removeChild(element);
	}
	
	//Create a link to trigger image generation
	let link = $(document.createElement('a'));
	$('.c-sort-config').append(link);
	link.text('Save Image');
	css(link,
		'cursor: pointer;' +
		'display: inline-block;' +
		'background: #007bff; color: #fff;' +
		'text-decoration: none !important;' +
		'border-radius: 1rem; padding: 1rem 2rem; margin: 0 1rem;'
	);
	
	//Wire up the link's event handler
	link.click(() =>
	{
		//Grab a reference to the DOM node we want to generate an image for
		let node = $('.cities-wrap');
		css(node,
			'background-color: transparent;' +
			'margin: 0 !important;' +
			'padding: 0;' +
			'padding-right: 1px;'
		);
		
		//Remove any image elements or image buttons nested in the node to prevent CORS loading errors
		$('img, .input-date__btn', node).remove();
		
		//Remove any hover styles
		$('.mtt-sticky', node).removeClass('mtt-sticky');
		
		//Remove any hover tooltips
		$('[data-mtt]', node).removeAttr('data-mtt');
		
		//Remove other unwanted decorations
		$('.city-item__marker, .wds', node).remove();
		
		//Inject our custom styles
		css($('.city-item'), 'border-left: 1px solid #000; border-right: 1px solid #000; border-radius: 0 !important; margin: 0 !important; opacity: 1 !important;');
		css($('.city-item:first-child'), 'border-top: 1px solid #000;');
		css($('.city-item:last-child'), 'border-bottom: 1px solid #000;');
		css($('.city-item:nth-child(odd)'), 'background: #fff !important; background-color: #fff !important;');
		css($('.city-item:nth-child(even)'), 'background: #f5f8fb !important; background-color: #f5f8fb !important;');
		css($('.city-item__date, .city-item__date.mtt-sticky'), 'color: #000 !important;');
		
		//Render the DOM node to an image
		//(Note: for some reason the DOM node appears to be offset when rendered with html2canvas, so we correct for this here)
		html2canvas(node.get(0), {scale: 4, scrollX: -8, scrollY: 0}).then((canvas) =>
		{
			//Trigger a download of the generated image
			download('timezones.png', canvas.toDataURL());
		});
	});
})();
