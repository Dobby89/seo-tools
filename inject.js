(function() {

    if(document.querySelector(".ao-seo-tool-container")) {
        document.querySelector(".ao-seo-tool-container").outerHTML='';
        return false;
    }

	// elms

	var closeElm = '<button class="ao-seo-tool-close">close</button>';

	// dom selectors

	var domTitle = document.title.length;
	var domDesc = document.querySelector('meta[name="description"]').content.length;
    var domImages = document.getElementsByTagName('img');
    var domImagesAlt = 0;
    var h1s = document.querySelectorAll('h1').length;

    // loops

	for (i = 0; i < domImages.length; i++) {
		if(domImages[i].alt) {
			domImagesAlt++;
		} else {
			domImages[i].style.border = "5px solid red";
		}
	}

    // validation

    var validateTitle = domTitle >= 55 && domTitle <= 60 ? 'valid-seo' : 'invalid-seo';
    var validateImages = domImages.length === domImagesAlt ? 'valid-seo' : 'invalid-seo';
    var validateDesc = domDesc <= 160 ? 'valid-seo' : 'invalid-seo';
    var validateH1 = h1s === 1 ? 'valid-seo' : 'invalid-seo';

    // header tag hierarchy check

    // var headerSizes = [];
    var headerSizseRange = [1,2,3,4,5,6];
    // headerSizseRange.forEach(function(size) {
    var headerSizes = headerSizseRange.map(function(size) {
        var foundHeaders = document.querySelectorAll('h' + size) || [];
        var foundHeaderContent = Array.from(foundHeaders).map(function (header) {
            return header.textContent;
        });

        return {
            headerSize: size,
            count: foundHeaders.length,
            content: foundHeaderContent
        };
    });

    console.log(headerSizes);

    var headerFeedback = [];
    headerSizes.reverse().forEach(function (item, index, list) {

        var feedbackString = '';
        feedbackString += 'There are ' + item.count + ' h' + item.headerSize + ' tags';

        if (item.count >= 1) {
            console.log(index + 1);
            if (list[index + 1] && list[index + 1].count == 0) {
                feedbackString += ' but NO h' + (index + 1) + 'tags';
            }
        }

        headerFeedback.push(feedbackString);
    });

    console.log(headerFeedback);

	// strings

	var elmTitle = '<p class="seo-title">ao-seo-tool</h1>';
    var domTitleString = '<p class="' + validateTitle + '">Title length: ' + domTitle + '</p>';
    var domDescString = '<p class="' + validateDesc + '">Meta desc length: ' + domDesc + '</p>';
    var domImagesStrings = '<p class="' + validateImages + '">Image count: ' + domImages.length + ', with alt: ' + domImagesAlt + ' </p>';
    var domH1String = '<p class="' + validateH1 + '">H1 count: ' + h1s + ' </p>';

	// entry & styling

	var div = document.createElement('div');
	var styleRef = '<link href="https://media.ao.com/uk/hackday/seo-tool/styles.css?v=2" rel="stylesheet" type="text/css">';
	div.classList.add('ao-seo-tool-container');

	// format the entry of all strings

	div.innerHTML = styleRef + elmTitle + domH1String + domImagesStrings + domDescString + domTitleString + closeElm;

	document.body.insertBefore(div, document.body.firstChild);

	// event listeners

	var closeBtn = document.querySelector('.ao-seo-tool-close');
	closeBtn.addEventListener("click", function(){
		document.querySelector(".ao-seo-tool-container").outerHTML='';
	});

	// check it actually works!

	console.warn("injected into self, giggity.");

})();