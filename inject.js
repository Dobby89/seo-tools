(function() {

	// elms

	var closeElm = '<button style="margin: 2%; float:left;" class="ao-seo-tool-close">close</button>';

	// dom selectors

	var domTitle = document.title.length;
	var domDesc = document.querySelector('meta[name="description"]').content.length;
	var domImages = document.getElementsByTagName('img');
	var domImagesAlt = 0;
	var domImageTitle = 0;

	// loops

	for (i = 0; i < domImages.length; i++) {
		if(domImages[i].alt) {
			domImagesAlt++;
		}
		if(domImages[i].title) {
			domImageTitle++;
		}
	}
	var h1s = document.querySelectorAll('h1').length;

	// strings

	var domTitleString = '<p style="margin: 10px;">the title is ' + domTitle + ' chars long</p>';
	var domDescString = '<p style="margin: 10px;">the description length is ' + domDesc + '</p>';
	var domImagesStrings = '<p style=margin: 10px;">there are ' + domImages.length + ' images, of these, ' + domImagesAlt + ' have alt tags and ' + domImageTitle + ' have titles.</p>';
	var domH1String = '<p style="margin: 10px;">there are ' + h1s + ' h1\'s on the page</p>';

	// entry & styling

	var div = document.createElement('div');
	div.classList.add('ao-seo-tool-container');
	div.style.position = 'fixed';
	div.style.top = 0;
	div.style.right = 0;
	div.style.height = '100%';
	div.style.width = '100%';
	div.style.zIndex = '99999999999999';
	div.style.backgroundColor = '#000';
	div.style.color = '#fff';
	div.style.fontSize = '20px';

	// format the entry of all strings

	div.innerHTML = domImagesStrings + domDescString + domTitleString + closeElm;

	document.body.appendChild(div);

	// event listeners

	var closeBtn = document.querySelector('.ao-seo-tool-close');
	closeBtn.addEventListener("click", function(){
		document.querySelector(".ao-seo-tool-container").outerHTML='';
	});

	// check it actually works!

	console.warn("injected into self, giggity.");

})();