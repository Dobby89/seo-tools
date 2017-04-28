(function() {

	// elms

	var closeElm = '<button style="margin: 2%; float:left;" class="ao-seo-tool-close">close</button>';

	// dom selectors

	var domTitle = document.title.length;
	var domDesc = document.querySelector('meta[name="description"]').content.length;
	var h1s = document.querySelectorAll('h1').length;

	// strings

	var domTitleString = '<p style="margin: 10px;">the title is ' + domTitle + ' chars long</p>';
	var domDescString = '<p style="margin: 10px;">the description length is ' + domDesc + '</p>';
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

	div.innerHTML = domDescString + domTitleString + closeElm;

	document.body.appendChild(div);

	// event listeners

	var closeBtn = document.querySelector('.ao-seo-tool-close');
	closeBtn.addEventListener("click", function(){
		document.querySelector(".ao-seo-tool-container").outerHTML='';
	});

	// check it actually works!

	console.warn("injected into self, giggity.");

})();