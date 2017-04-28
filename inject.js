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
    var missingAlts = [];

    // loops

	for (i = 0; i < domImages.length; i++) {
		if(domImages[i].alt) {
			domImagesAlt++;
		} else {
            var src = domImages[i].src;
			domImages[i].style.border = "5px solid red";
            missingAlts.push('<li class="array-item" title="' + src + '">' + (src.length > 50 ? src.substring(0,50) + '...' : src) + '</li>');
		}
	}

    // validation

    var validateTitle = domTitle >= 55 && domTitle <= 60 ? 'valid-seo' : 'invalid-seo';
    var validateImages = domImages.length === domImagesAlt ? 'valid-seo' : 'invalid-seo';
    var validateDesc = domDesc <= 160 ? 'valid-seo' : 'invalid-seo';
    var validateH1 = h1s === 1 ? 'valid-seo' : 'invalid-seo';
    var altDropDown = missingAlts ? '<div class="more-info">' + '<ul class="hide">' + missingAlts.join('') + '</ul></div>' : '';
    var moreInfoBtn = '<span class="more-info-button"> more info...</span>';

    // header tag hierarchy check

    var headerSizseRange = [1,2,3,4,5,6];
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

    headerSizes.reverse().forEach(function (item, index, list) {

        var isValid = true;

        if (item.count >= 1 && item.headerSize > 1) {
            if (list[index + 1] && list[index + 1].count == 0) {
                isValid = false;
            }
        }

        headerSizes[index]['isValid'] = isValid;
    });

    console.log(headerSizes.reverse());

	// strings

	var elmTitle = '<p class="seo-title">ao-seo-tool</h1>';
    var domTitleString = '<p class="' + validateTitle + '">Title length: ' + domTitle + '</p>';
    var domDescString = '<p class="' + validateDesc + '">Meta desc length: ' + domDesc + '</p>';
    var domImagesStrings = '<p style="display: inline" class="' + validateImages + '">Image count: ' + domImages.length + ', with alt: ' + domImagesAlt + ' </p>' + moreInfoBtn + altDropDown;
    var domH1String = '<p class="' + validateH1 + '">H1 count: ' + h1s + ' </p>';

	// entry & styling

	var div = document.createElement('div');
	var styleRef = '<link href="https://media.ao.com/uk/hackday/seo-tool/styles.css" rel="stylesheet" type="text/css">';
	div.classList.add('ao-seo-tool-container');

	// format the entry of all strings

	div.innerHTML = styleRef + elmTitle + domH1String + domImagesStrings + domDescString + domTitleString + closeElm;

	document.body.insertBefore(div, document.body.firstChild);

	// event listeners

	var closeBtn = document.querySelector('.ao-seo-tool-close');
	closeBtn.addEventListener("click", function(){
		document.querySelector(".ao-seo-tool-container").outerHTML='';
	});

    var moreInfoButton = document.querySelector('.more-info-button');
    var moreInfo = document.querySelector('.more-info');
    if(moreInfo) {
        moreInfoButton.addEventListener("click", function() {
            document.querySelector('.more-info ul').classList.toggle('hide');
        });
    }

	// check it actually works!

	console.warn("injected into self, giggity.");

})();