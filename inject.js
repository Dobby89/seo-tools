(function() {

    if(document.querySelector(".ao-seo-tool-container")) {
        document.querySelector(".ao-seo-tool-container").outerHTML='';
        return false;
    }

	// dom selectors

	var domTitle = document.title.length;
	var domDesc = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]') : '';
    var domImages = document.getElementsByTagName('img');
    var imageAltCount = 0;
    var domH1s = document.querySelectorAll('h1');

    var metaErrorsArray = [];
    var imageErrorsArray = [];
    var headerErrorsArray = [];

    var metaSuccessArray = [];
    var imageSuccessArray = [];
    var headerSuccessArray = [];

    // validation

    // var validateTitle = domTitle >= 55 && domTitle <= 60 ? 'valid-seo' : 'invalid-seo';
    // var validateImages = domImages.length === imageAltCount ? 'valid-seo' : 'invalid-seo';
    // var validateDesc = domDesc <= 160 ? 'valid-seo' : 'invalid-seo';
    // var validateH1 = domH1s.length === 1 ? 'valid-seo' : 'invalid-seo';
    // var altDropDown = imageErrorsArray ? '<div class="more-info">' + '<ul class="hide">' + imageErrorsArray.join('') + '</ul></div>' : '';
    // var moreInfoBtn = imageErrorsArray.length ? '<span class="more-info-button"> more info...</span>' : '';
    // var showMeBtn = imageErrorsArray.length ? '<span class="show-me-button"> show me...</span>' : '';


    // Meta tag validation
    if (domDesc.content.length === 0) {
        metaErrorsArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                <div class="ao-seo-tool-table-cell">
                    Meta Description
                </div>
                <div class="ao-seo-tool-table-cell">
                    No Meta Description has been found. <b>Every</b> page must contain a Meta Description.
                </div>
                <div class="ao-seo-tool-table-cell">
                    
                </div>
            </div>`);
    } else if (domDesc.content.length > 160) {
        metaErrorsArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                <div class="ao-seo-tool-table-cell">
                    Meta Description
                </div>
                <div class="ao-seo-tool-table-cell">
                    The Meta Description is more than <b>160</b> characters.
                </div>
                <div class="ao-seo-tool-table-cell">
                    ${htmlEscape(domDesc.outerHTML)}
                </div>
            </div>`);
    } else {
        // valid
        metaSuccessArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-valid">
                <div class="ao-seo-tool-table-cell">
                    Meta Description
                </div>
                <div class="ao-seo-tool-table-cell">
                    The Meta Description is present and is <= <b>160</b> characters.
                </div>
                <div class="ao-seo-tool-table-cell">
                    ${htmlEscape(domDesc.outerHTML)}
                </div>
            </div>`);
    }


    // H1 tag validation
    if (domH1s.length === 0) {
        headerErrorsArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                <div class="ao-seo-tool-table-cell">
                    <code>&lt;h1&gt;</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    No <code>&lt;h1&gt;</code> tag has been found. <b>Every</b> page must contain a <code>&lt;h1&gt;</code> tag.
                </div>
                <div class="ao-seo-tool-table-cell">

                </div>
            </div>`);
    } else if (domH1s.length > 1) {
        headerErrorsArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                <div class="ao-seo-tool-table-cell">
                    <code>&lt;h1&gt;</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    ${domH1s.length} <code>&lt;h1&gt;</code> tags have been found. There should only be <b>one</b> <code>&lt;h1&gt;</code> tag per page.
                </div>
                <div class="ao-seo-tool-table-cell">

                </div>
            </div>`);
    } else {
        headerSuccessArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-valid">
                <div class="ao-seo-tool-table-cell">
                    <code>&lt;h1&gt;</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    <code>&lt;h1&gt;</code> tag exists and is the only one on the page.
                </div>
                <div class="ao-seo-tool-table-cell">
                    ${htmlEscape(domH1s[0].outerHTML)}
                </div>
            </div>`);
    }

    // header tag hierarchy check
    var headerSizeRange = [1,2,3,4,5,6];
    var headerSizes = headerSizeRange.map(function(size) {
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

    // validate header tags, checking that the correct hierarchy has been followed
    // e.g. Only h4 tags should be used if h3 tags have been used
    headerSizes.reverse().forEach(function (item, index, list) {

        var isValid = true;

        if (item.count >= 1 && item.headerSize > 1) {
            if (list[index + 1] && list[index + 1].count == 0) {
                isValid = false;
            }
        }

        headerSizes[index]['isValid'] = isValid;
    });


    // Heading hierarchy validation
    headerSizes.reverse().forEach(function (item, index, list) {
        if (!item.isValid) {
            headerErrorsArray.push(`
                <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                    <div class="ao-seo-tool-table-cell">
                        <code>&lt;h${item.headerSize}&gt;</code> tag
                    </div>
                    <div class="ao-seo-tool-table-cell">
                        <code>&lt;h${item.headerSize}&gt;</code> tag has been used but no h${index} has been found.
                    </div>
                    <div class="ao-seo-tool-table-cell">

                    </div>
                </div>`);

            // Create a style element and add styles to highlights issues
            var style = document.createElement("style");
            document.head.appendChild(style);
            sheet = style.sheet;
            sheet.insertRule('h' + item.headerSize + ' { border: 5px solid red; }', 0);

        } else if (item.headerSize > 1) {
            console.log('H' + item.headerSize + ' count: ' + item.count);
        }
    });


    // Image validation
    for (i = 0; i < domImages.length; i++) {

        var image = domImages[i];

        if(image.alt) {
            imageAltCount++;
        } else {
            imageErrorsArray.push(`<div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                    <div class="ao-seo-tool-table-cell" style="width: 100px;">
                        <img src="${image.src}">
                    </div>
                    <div class="ao-seo-tool-table-cell">
                        No alt attribute has been used on this image.
                    </div>
                    <div class="ao-seo-tool-table-cell">
                        <code>
                            ${htmlEscape(image.outerHTML)}
                        </code>
                    </div>
                </div>`);

            image.classList.add('ao-seo-tool-image-error');
        }
    }



	// strings

    // var elmTitle = '<p class="seo-title">ao-seo-tool</h1>';
    // var domTitleString = '<p class="' + validateTitle + '">Title length: ' + domTitle + '</p>';
    // var domDescString = '<p class="' + validateDesc + '">Meta desc length: ' + domDesc + '</p>';
    // var domImagesStrings = '<p style="display: inline" class="' + validateImages + '">Image count: ' + domImages.length + ', with alt: ' + imageAltCount + ' </p>' + moreInfoBtn + showMeBtn + altDropDown;
    // var domH1String = '<p class="' + validateH1 + '">H1 count: ' + domH1s.length + ' </p>';

	// entry & styling

	// var div = document.createElement('div');
	// var styleRef = '<link href="https://media.ao.com/uk/hackday/seo-tool/styles.css" rel="stylesheet" type="text/css">';
	// div.classList.add('ao-seo-tool-container');
    //
	// // format the entry of all strings
    //
	// div.innerHTML = styleRef + elmTitle + domH1String + domHeaderString + domImagesStrings + domDescString + domTitleString;
    //
	// document.body.insertBefore(div, document.body.firstChild);

	// event listeners

    //
    // var moreInfoButton = document.querySelector('.more-info-button');
    // var moreInfo = document.querySelector('.more-info');
    // if(moreInfo) {
    //     moreInfoButton.addEventListener("click", function() {
    //         document.querySelector('.more-info ul').classList.toggle('hide');
    //     });
    // }
    //
    // var showMeButton = document.querySelector('.show-me-button');
    // if(imageErrorsArray) {
    //     showMeButton.addEventListener("click", function() {
    //
    //         var elms = document.querySelectorAll('.seo-image-error');
    //
    //         for(var i = 0; i < elms.length; i++) {
    //             elms[i].style.border = '5px solid red';
    //         }
    //     });
    // }

    var aoSeoToolMarkup = `
    <link href="http://media.ao.com/uk/hackday/seo-tool/restyle.css" rel="stylesheet" type="text/css">
    <div class="ao-seo-tool">
        <div class="ao-seo-tool-container">
            <div class="ao-seo-tool-navigation">
                <div class="ao-seo-tool-title">SEO Tool</div>
                <div class="ao-seo-tool-tabs">
                    <div class="ao-seo-tool-tab ${metaErrorsArray.length ? 'ao-seo-tool-invalid' : 'ao-seo-tool-valid'}" data-ao-seo-tool-tab-target="ao-seo-tool-meta-data">Meta Data</div>
                    <div class="ao-seo-tool-tab ${headerErrorsArray.length ? 'ao-seo-tool-invalid' : 'ao-seo-tool-valid'}" data-ao-seo-tool-tab-target="ao-seo-tool-headings">Headings</div>
                    <div class="ao-seo-tool-tab ${imageErrorsArray.length ? 'ao-seo-tool-invalid' : 'ao-seo-tool-valid'}" data-ao-seo-tool-tab-target="ao-seo-tool-images">Images</div>
                </div>
            </div>
            <div class="ao-seo-tool-tab-dashboard">
                <div class="ao-seo-tool-tab-dashboard-header">
                    <div class="ao-seo-tool-tab-dashboard-header-summary">
                        3 errors found
                    </div>
                    <div class="ao-seo-tool-tab-dashboard-header-buttons">
                        <div class="ao-seo-tool-close">&times; Close</div>
                    </div>
                </div>
                <div class="ao-seo-tool-tab-dashboard-content">
                    <div id="ao-seo-tool-meta-data" class="ao-seo-tool-tab-content">
                    
                        <div class="ao-seo-tool-toggle-errors ao-seo-tool-link">Highlight errors on the page</div>
                    
                        <div class="ao-seo-tool-table">
                            <div class="ao-seo-tool-table-row">
                                <div class="ao-seo-tool-table-head">
                                    Item
                                </div>
                                <div class="ao-seo-tool-table-head" style="width: 40%">
                                    Details
                                </div>
                                <div class="ao-seo-tool-table-head">
                                    Markup
                                </div>
                            </div>
                            ${metaErrorsArray.join("")}
                            ${metaSuccessArray.join("")}
                        </div>
                    </div>
                    
                    <div id="ao-seo-tool-headings" class="ao-seo-tool-tab-content">
    
                        <div class="ao-seo-tool-toggle-errors ao-seo-tool-link">Highlight errors on the page</div>
    
                        <div class="ao-seo-tool-table">
                            <div class="ao-seo-tool-table-row">
                                <div class="ao-seo-tool-table-head">
                                    Item
                                </div>
                                <div class="ao-seo-tool-table-head" style="width: 40%">
                                    Details
                                </div>
                                <div class="ao-seo-tool-table-head">
                                    Markup
                                </div>
                            </div>
                            ${headerErrorsArray.join("")}
                            ${headerSuccessArray.join("")}
                        </div>
                    </div>
                    
                    <div id="ao-seo-tool-images" class="ao-seo-tool-tab-content">
    
                        <div class="ao-seo-tool-toggle-errors ao-seo-tool-link">Highlight errors on the page</div>
    
                        <div class="ao-seo-tool-table">
                            <div class="ao-seo-tool-table-row">
                                <div class="ao-seo-tool-table-head">
                                    Item
                                </div>
                                <div class="ao-seo-tool-table-head" style="width: 40%">
                                    Details
                                </div>
                                <div class="ao-seo-tool-table-head">
                                    Markup
                                </div>
                            </div>
                            ${imageErrorsArray.join("")}
                            ${imageSuccessArray.join("")}
                        </div>
                    </div>
                </div>
            </div>
            <div style="clear: both;"></div>
        </div>
    </div>
    `;

    var markup = document.createElement('div');
    var bodyElement = document.querySelector('body');
    markup.innerHTML = aoSeoToolMarkup;

    bodyElement.insertBefore(markup, bodyElement.firstChild);

    var closeBtn = document.querySelector('body .ao-seo-tool-close');
    closeBtn.addEventListener('click', function(){
        document.querySelector('.ao-seo-tool').outerHTML='';
    });

    var navTabs = document.querySelectorAll('body .ao-seo-tool-tab');
    var tabContents = document.querySelectorAll('.ao-seo-tool-tab-content');
    navTabs.forEach(function (item) {
        item.addEventListener('click', tabClicked, false);
    });

    function tabClicked(e) {
        var elm = e.target;
        var tabId = elm.getAttribute('data-ao-seo-tool-tab-target');
        var targetTab = document.querySelector(`#${tabId}`);

        // show/hide tab content
        tabContents.forEach(function (content) {
            content.classList.remove('ao-seo-tool-active');
        });
        targetTab.classList.add('ao-seo-tool-active');

        // set state of tabs
        navTabs.forEach(function (tab) {
            tab.classList.remove('ao-seo-tool-active');
        });
        elm.classList.add('ao-seo-tool-active');
    }

    var toggleErrorLinks = document.querySelectorAll('.ao-seo-tool-toggle-errors');
    toggleErrorLinks.forEach(function (item) {
        item.addEventListener('click', toggleErrors, false);
    });
    function toggleErrors(e) {
        var elm = e.target;


    }

	// check it actually works!

	console.warn('injected into self, giggity.');

    function htmlEscape(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

})();