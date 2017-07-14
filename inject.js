(function() {

    if(document.querySelector(".ao-seo-tool-container")) {
        document.querySelector(".ao-seo-tool-container").outerHTML='';
        return false;
    }

	// dom selectors
	var domMetaTitle = document.title;
	var domMetaDesc = document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]') : '';
    var domImages = document.getElementsByTagName('img');
    var domH1s = document.querySelectorAll('h1');
    var imageAltCount = 0;
    var imagesWithoutAlt = [];
    var headerHierarchyCount = 0;
    var headersWithWrongHierarchy = [];

    var metaErrorsArray = [];
    var imageErrorsArray = [];
    var headerErrorsArray = [];

    var metaSuccessArray = [];
    var imageSuccessArray = [];
    var headerSuccessArray = [];


    // Meta title validation
    if (!domMetaTitle) {
        // invalid
        metaErrorsArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                <div class="ao-seo-tool-table-cell">
                    <code>${htmlEscape('<title></title>')}</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    The <code>&lt;title&gt;</code> tag has not been found. <b>Every</b> page must contain a <code>&lt;title&gt;</code> tag, which is between <b>55</b> and <b>60</b> characters
                </div>
            </div>`);
    } else if (domMetaTitle.length >= 40 && domMetaTitle.length <= 60) {
        // valid
        metaSuccessArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-valid">
                <div class="ao-seo-tool-table-cell">
                    <code>${htmlEscape('<title>')}${domMetaTitle}${htmlEscape('</title>')}</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    The <code>&lt;title&gt;</code> is <b>${domMetaTitle.length}</b> characters, which is between the recommended <b>40</b> and <b>60</b> characters.
                </div>
            </div>`);
    } else {
        // invalid
        metaErrorsArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-warning">
                <div class="ao-seo-tool-table-cell">
                    <code>${htmlEscape('<title>')}${domMetaTitle}${htmlEscape('</title>')}</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    The <code>&lt;title&gt;</code> tag is <b>${domMetaTitle.length}</b> characters, but should be between <b>40</b> and <b>60</b> characters.
                </div>
            </div>`);
    }


    // Meta description validation
    if (!domMetaDesc) {
        metaErrorsArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                <div class="ao-seo-tool-table-cell">
                    <code>${htmlEscape('<meta name="description" content="">')}</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    No Meta Description has been found. <b>Every</b> page must contain a Meta Description.
                </div>
            </div>`);
    } else if (domMetaDesc.content.length > 160) {
        metaErrorsArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                <div class="ao-seo-tool-table-cell">
                    <code>${htmlEscape(domMetaDesc.outerHTML)}</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    The Meta Description is <b>${domMetaDesc.content.length}</b> characters, which is more than the recommended <b>160</b> characters.
                </div>
            </div>`);
    } else {
        // valid
        metaSuccessArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-valid">
                <div class="ao-seo-tool-table-cell">
                    <code>${htmlEscape(domMetaDesc.outerHTML)}</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    The Meta Description is <b>${domMetaDesc.content.length}</b> characters, which is within the recommended <b>160</b> character limit.
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
            </div>`);
    } else if (domH1s.length > 1) {

        var h1tags = [];
        for (i = 0; i < domH1s.length; i++) {
            h1tags.push(`<code>${htmlEscape(domH1s[i].outerHTML)}</code>`);
        }

        headerErrorsArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                <div class="ao-seo-tool-table-cell">
                    ${h1tags.join("<br>")}
                </div>
                <div class="ao-seo-tool-table-cell">
                    ${domH1s.length} <code>&lt;h1&gt;</code> tags have been found. There should only be <b>one</b> <code>&lt;h1&gt;</code> tag per page.
                </div>
            </div>`);
    } else {
        headerSuccessArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-valid">
                <div class="ao-seo-tool-table-cell">
                    <code>${htmlEscape(domH1s[0].outerHTML)}</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    <code>&lt;h1&gt;</code> tag exists and is the only one on the page.
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

            headerHierarchyCount++;

            var headers = document.querySelectorAll(`h${item.headerSize}`);
            var headerCode = [];

            headers.forEach(function (header) {
                headerCode.push(`<code>${htmlEscape(header.outerHTML)}</code>`);
            });

            headerErrorsArray.push(`
                <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                    <div class="ao-seo-tool-table-cell">
                        ${headerCode.join("<br>")}
                    </div>
                    <div class="ao-seo-tool-table-cell">
                        ${headerCode.length} <code>&lt;h${item.headerSize}&gt;</code> ${headerCode.length > 1 ? 'tags have' : 'tag has'} been used but no <code>&lt;h${index}&gt;</code> tag has been found.
                    </div>
                </div>`);

            // ao-seo-tool-error-highlight

        } else if (item.headerSize > 1) {
            // console.log('H' + item.headerSize + ' count: ' + item.count);
        }
    });

    if (headerHierarchyCount === 0) {
        headerSuccessArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-valid">
                <div class="ao-seo-tool-table-cell">
                    <code>${htmlEscape('<h1> <h2> <h3> <h4> <h5> <h6>')}</code>
                </div>
                <div class="ao-seo-tool-table-cell">
                    All header tags follow the correct hierarchy.
                </div>
            </div>`);
    }


    // Image validation
    for (i = 0; i < domImages.length; i++) {

        var image = domImages[i];

        if(image.alt) {
            imageAltCount++;
        } else {
            imageErrorsArray.push(`
                <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
                    <div class="ao-seo-tool-table-cell" style="width: 100px;">
                        <code>
                            ${htmlEscape(image.outerHTML)}
                        </code>
                        <img src="${image.src}" />
                    </div>
                    <div class="ao-seo-tool-table-cell">
                        No alt attribute has been used on this image.
                    </div>
                </div>`);

            imagesWithoutAlt.push(image);
        }
    }

    if (imageAltCount === 0) {
        imageSuccessArray.push(`
            <div class="ao-seo-tool-table-row ao-seo-tool-valid">
                <div class="ao-seo-tool-table-cell" style="width: 100px;">
                    Image <code>alt=""</code> attributes
                </div>
                <div class="ao-seo-tool-table-cell">
                    All images have alt tags present.
                </div>
            </div>`);
    }



	// strings

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


    var totalErrors = metaErrorsArray.length + headerErrorsArray.length + imageErrorsArray.length;
    var numOfErrorsText = `${totalErrors} ${totalErrors !== 1 ? 'errors' : 'error'} found`;

    var aoSeoToolMarkup = `
    <link href="https://media.ao.com/uk/hackday/seo-tool/restyle.css" rel="stylesheet" type="text/css">
    <div class="ao-seo-tool">
        <div class="ao-seo-tool-container">
            <div class="ao-seo-tool-navigation">
                <div class="ao-seo-tool-title">SEO Tool</div>
                <div class="ao-seo-tool-tabs">
                    <div class="ao-seo-tool-tab ao-seo-tool-active ${metaErrorsArray.length ? 'ao-seo-tool-invalid' : 'ao-seo-tool-valid'}" data-ao-seo-tool-tab-target="ao-seo-tool-meta-data">Meta Data</div>
                    <div class="ao-seo-tool-tab ${headerErrorsArray.length ? 'ao-seo-tool-invalid' : 'ao-seo-tool-valid'}" data-ao-seo-tool-tab-target="ao-seo-tool-headings">Headings</div>
                    <div class="ao-seo-tool-tab ${imageErrorsArray.length ? 'ao-seo-tool-invalid' : 'ao-seo-tool-valid'}" data-ao-seo-tool-tab-target="ao-seo-tool-images">Images</div>
                </div>
            </div>
            <div class="ao-seo-tool-tab-dashboard">
                <div class="ao-seo-tool-tab-dashboard-header">
                    <div class="ao-seo-tool-tab-dashboard-header-summary">
                        ${numOfErrorsText}
                    </div>
                    <div class="ao-seo-tool-tab-dashboard-header-buttons">
                        <div class="ao-seo-tool-toggle-errors ao-seo-tool-button">Show Errors?</div>
                        <div class="ao-seo-tool-close ao-seo-tool-button ao-seo-tool-button-red">&times; Close</div>
                    </div>
                </div>
                <div class="ao-seo-tool-tab-dashboard-content">
                    <div id="ao-seo-tool-meta-data" class="ao-seo-tool-tab-content ao-seo-tool-active">
                        <div class="ao-seo-tool-table">
                            <div class="ao-seo-tool-table-row">
                                <div class="ao-seo-tool-table-head" style="width: 50%">
                                    Item
                                </div>
                                <div class="ao-seo-tool-table-head" style="width: 50%">
                                    Details
                                </div>
                            </div>
                            ${metaErrorsArray.join("")}
                            ${metaSuccessArray.join("")}
                        </div>
                    </div>
                    
                    <div id="ao-seo-tool-headings" class="ao-seo-tool-tab-content">    
                        <div class="ao-seo-tool-table">
                            <div class="ao-seo-tool-table-row">
                                <div class="ao-seo-tool-table-head" style="width: 50%">
                                    Item
                                </div>
                                <div class="ao-seo-tool-table-head" style="width: 50%">
                                    Details
                                </div>
                            </div>
                            ${headerErrorsArray.join("")}
                            ${headerSuccessArray.join("")}
                        </div>
                    </div>
                    
                    <div id="ao-seo-tool-images" class="ao-seo-tool-tab-content">
                        <div class="ao-seo-tool-table">
                            <div class="ao-seo-tool-table-row">
                                <div class="ao-seo-tool-table-head" style="width: 50%">
                                    Item
                                </div>
                                <div class="ao-seo-tool-table-head" style="width: 50%">
                                    Details
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

    var toggleErrorsBtn = document.querySelector('body .ao-seo-tool-toggle-errors');
    toggleErrorsBtn.addEventListener('click', highlightErrors, false);

    function highlightErrors(e) {

        var elm = e.target;
        var highlightedElements = document.querySelectorAll('body .ao-seo-tool-error-highlight');

        highlightedElements.forEach(function (highlightedElm) {
            highlightedElm.classList.remove('ao-seo-tool-error-highlight');
        });

        if (!elm.classList.contains('ao-seo-tool-active')) {
            imagesWithoutAlt.forEach(function (image) {
                image.classList.add('ao-seo-tool-error-highlight');
            });

            headerSizes.forEach(function (headerSize) {
                if (!headerSize.isValid) {
                    var invalidHeaders = document.querySelectorAll(`h${headerSize.headerSize}`);
                    invalidHeaders.forEach(function (header) {
                        header.classList.add('ao-seo-tool-error-highlight');
                    });
                }
            });

            if (domH1s.length > 1) {
                domH1s.forEach(function (h1) {
                    console.log(h1);
                    h1.classList.add('ao-seo-tool-error-highlight');
                })
            }
        }

        elm.classList.toggle('ao-seo-tool-active');
    }

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

    function htmlEscape(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

})();