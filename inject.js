(function() {

	// elms

	var closeElm = '<button style="margin: 2%;" class="ao-seo-tool-close">close</button>';

	// dom selectors 

	var domTitle = document.title.length;

	// strings

	var domTitleString = 'the title is ' + domTitle + ' chars long';

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

	div.innerHTML = domTitleString + closeElm;

	document.body.appendChild(div);

	// event listeners

	var closeBtn = document.querySelector('.ao-seo-tool-close');
	closeBtn.addEventListener("click", function(){
		document.querySelector(".ao-seo-tool-container").outerHTML='';
	});

	// check it actually works!

	console.warn("injected into self, giggity.");

})();