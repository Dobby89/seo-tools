(function() {

	// elms

	var closeElm = '<button style="margin: 2%; float:left;" class="ao-seo-tool-close">close</button>';

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
        }
    }

    // validation

    var validateTitle = domTitle >= 55 && domTitle <= 60 ? 'green' : 'red';
    var validateImages = domImages.length === domImagesAlt ? 'green' : 'red';
    var validateDesc = domDesc <= 160 ? 'green' : 'red';
    var validateH1 = h1s === 1 ? 'green' : 'red';

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

    var domTitleString = '<p style="margin: 10px; color:' + validateTitle + '">the title is ' + domTitle + ' chars long</p>';
    var domDescString = '<p style="margin: 10px; color:' + validateDesc + '">the description length is ' + domDesc + '</p>';
    var domImagesStrings = '<p style="margin: 10px; color:' + validateImages + '">there are ' + domImages.length + ' images, of these, ' + domImagesAlt + ' have alt tags</p>';
    var domH1String = '<p style="margin: 10px; color:' + validateH1 + '">there are ' + h1s + ' h1\'s on the page</p>';

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

	div.innerHTML = domH1String + domImagesStrings + domDescString + domTitleString + closeElm;

	document.body.appendChild(div);

	// event listeners

	var closeBtn = document.querySelector('.ao-seo-tool-close');
	closeBtn.addEventListener("click", function(){
		document.querySelector(".ao-seo-tool-container").outerHTML='';
	});

	// check it actually works!

	console.warn("injected into self, giggity.");

})();