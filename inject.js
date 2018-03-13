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
    var imagesWithAltCount = 0;
    var headerHierarchyErrorCount = 0;
    var imagesWithoutAlt = [];
    const headerSizeRange = [1,2,3,4,5,6];

    let validationMessages = {
        metaData: {
            tabTitle: 'Meta Data',
            tabClass: 'meta-data',
            errorArray: [],
            warningArray: [],
            successArray: []
        },
        headings: {
            tabTitle: 'Headings',
            tabClass: 'headings',
            errorArray: [],
            warningArray: [],
            successArray: []
        },
        images: {
            tabTitle: 'Images',
            tabClass: 'images',
            errorArray: [],
            warningArray: [],
            successArray: []
        }
    };

    let metaErrors = [];
    let imageErrors = [];


    // Meta title validation
    if (!domMetaTitle) {
        // error
        validationMessages.metaData.errorArray.push({
            snippet: `<code>${htmlEscape('<title></title>')}</code>`,
            message: `The <code>&lt;title&gt;</code> tag has not been found. <b>Every</b> page must contain a <code>&lt;title&gt;</code> tag, which is between <b>55</b> and <b>60</b> characters`
        });

        // metaErrorsArray.push(`
        //     <div class="ao-seo-tool-table-row ao-seo-tool-invalid">
        //         <div class="ao-seo-tool-table-cell">
        //             <code>${htmlEscape('<title></title>')}</code>
        //         </div>
        //         <div class="ao-seo-tool-table-cell">
        //             The <code>&lt;title&gt;</code> tag has not been found. <b>Every</b> page must contain a <code>&lt;title&gt;</code> tag, which is between <b>55</b> and <b>60</b> characters
        //         </div>
        //     </div>`);
    } else if (domMetaTitle.length >= 40 && domMetaTitle.length <= 60) {
        // success
        validationMessages.metaData.successArray.push({
            snippet: `<code>${htmlEscape('<title>')}${domMetaTitle}${htmlEscape('</title>')}</code>`,
            message: `The <code>&lt;title&gt;</code> is <b>${domMetaTitle.length}</b> characters, which is between the recommended <b>40</b> and <b>60</b> characters.`
        });
    } else {
        // warning
        validationMessages.metaData.warningArray.push({
            snippet: `<code>${htmlEscape('<title>')}${domMetaTitle}${htmlEscape('</title>')}</code>`,
            message: `The <code>&lt;title&gt;</code> tag is <b>${domMetaTitle.length}</b> characters, but should be between <b>40</b> and <b>60</b> characters.`
        });
    }


    // Meta description validation
    if (!domMetaDesc) {
        // error
        validationMessages.metaData.errorArray.push({
            snippet: `<code>${htmlEscape('<meta name="description" content="">')}</code>`,
            message: `No Meta Description has been found. <b>Every</b> page must contain a Meta Description.`
        });
    } else if (domMetaDesc.content.length > 300) {
        // warning
        validationMessages.metaData.warningArray.push({
            snippet: `<code>${htmlEscape(domMetaDesc.outerHTML)}</code>`,
            message: `The Meta Description is <b>${domMetaDesc.content.length}</b> characters, which is more than the recommended <b>300</b> characters.`
        });
    } else {
        // success
        validationMessages.metaData.successArray.push({
            snippet: `<code>${htmlEscape(domMetaDesc.outerHTML)}</code>`,
            message: `The Meta Description is <b>${domMetaDesc.content.length}</b> characters, which is within the recommended <b>300</b> character limit.`
        });
    }


    // H1 tag validation
    if (domH1s.length === 0) {
        // invalid
        validationMessages.headings.errorArray.push({
            snippet: `<code>&lt;h1&gt;</code>`,
            message: `No <code>&lt;h1&gt;</code> tag has been found. <b>Every</b> page must contain a <code>&lt;h1&gt;</code> tag.`
        });
    } else if (domH1s.length > 1) {
        // invalid

        let h1tags = [];
        for (i = 0; i < domH1s.length; i++) {
            h1tags.push(`<code>${htmlEscape(domH1s[i].outerHTML)}</code>`);
        }

        validationMessages.headings.errorArray.push({
            snippet: `${h1tags.join("<br>")}`,
            message: `${domH1s.length} <code>&lt;h1&gt;</code> tags have been found. There should only be <b>one</b> <code>&lt;h1&gt;</code> tag per page.`
        });
    } else {
        // valid
        validationMessages.headings.successArray.push({
            snippet: `<code>${htmlEscape(domH1s[0].outerHTML)}</code>`,
            message: `<code>&lt;h1&gt;</code> tag exists and is the only one on the page.`
        });
    }

    // header tag hierarchy check
    let headerSizes = headerSizeRange.map(function(size) {
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

            headerHierarchyErrorCount++;

            var headers = document.querySelectorAll(`h${item.headerSize}`);
            var headerCode = [];

            headers.forEach(function (header) {
                headerCode.push(`<code>${htmlEscape(header.outerHTML)}</code>`);
            });

            // invalid
            validationMessages.headings.errorArray.push({
                snippet: `${headerCode.join("<br>")}`,
                message: `${headerCode.length} <code>&lt;h${item.headerSize}&gt;</code> ${headerCode.length > 1 ? 'tags have' : 'tag has'} been used but no <code>&lt;h${index}&gt;</code> tag has been found.`
            });
        }
    });

    // No header hierarchy errors have been found, so log a success
    if (headerHierarchyErrorCount === 0) {
        // valid
        validationMessages.headings.successArray.push({
            snippet: `<code>${htmlEscape('<h1> <h2> <h3> <h4> <h5> <h6>')}</code>`,
            message: `All header tags follow the correct hierarchy.`
        });
    }


    // Image validation
    for (i = 0; i < domImages.length; i++) {

        var image = domImages[i];

        if(image.alt) {
            imagesWithAltCount++;
        } else {
            // invalid
            validationMessages.images.errorArray.push({
                snippet: `<code>${htmlEscape(image.outerHTML)}</code><img src="${image.src}" />`,
                message: `No alt attribute has been used on this image.`
            });

            // Used later to visually highlight images without alt tags on the page
            imagesWithoutAlt.push(image);
        }
    }

    if (imagesWithAltCount === 0) {
        // valid
        validationMessages.images.successArray.push({
            snippet: `Image <code>alt=""</code> attributes`,
            message: `All images have alt tags present.`
        });
    }

    const totalErrors = countValidationMessagesByType(['errorArray', 'warningArray']);
    const errorsSummaryText = `${totalErrors} ${totalErrors !== 1 ? 'errors' : 'error'} found`; // pluralise if required

    const totalMetaDataErrors = validationMessages.metaData.errorArray.length + validationMessages.metaData.warningArray.length;
    const totalHeadingsErrors = validationMessages.headings.errorArray.length + validationMessages.headings.warningArray.length;
    const totalImagesErrors = validationMessages.images.errorArray.length + validationMessages.images.warningArray.length;

    let tabContentMarkup = createTabContentMarkup();

    var aoSeoToolMarkup = `
    <link href="https://media.ao.com/uk/hackday/seo-tool/restyle.css" rel="stylesheet" type="text/css">
    <div class="ao-seo-tool">
        <div class="ao-seo-tool-container">
            <div class="ao-seo-tool-navigation">
                <div class="ao-seo-tool-title">SEO Tool</div>
                <div class="ao-seo-tool-tabs">
                    <div class="ao-seo-tool-tab ${totalMetaDataErrors ? 'ao-seo-tool-invalid' : 'ao-seo-tool-valid'}" data-ao-seo-tool-tab-target="ao-seo-tool-meta-data">Meta Data</div>
                    <div class="ao-seo-tool-tab ${totalHeadingsErrors ? 'ao-seo-tool-invalid' : 'ao-seo-tool-valid'}" data-ao-seo-tool-tab-target="ao-seo-tool-headings">Headings</div>
                    <div class="ao-seo-tool-tab ${totalImagesErrors ? 'ao-seo-tool-invalid' : 'ao-seo-tool-valid'}" data-ao-seo-tool-tab-target="ao-seo-tool-images">Images</div>
                </div>
            </div>
            <div class="ao-seo-tool-tab-dashboard">
                <div class="ao-seo-tool-tab-dashboard-header">
                    <div class="ao-seo-tool-tab-dashboard-header-summary">
                        ${errorsSummaryText}
                    </div>
                    <div class="ao-seo-tool-tab-dashboard-header-buttons">
                        <div class="ao-seo-tool-toggle-errors ao-seo-tool-button">Show Errors?</div>
                        <div class="ao-seo-tool-close ao-seo-tool-button ao-seo-tool-button-red">&times; Close</div>
                    </div>
                </div>
                <div class="ao-seo-tool-tab-dashboard-content">
                    ${tabContentMarkup}
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
                    h1.classList.add('ao-seo-tool-error-highlight');
                })
            }
        }

        elm.classList.toggle('ao-seo-tool-active');
    }

    var navTabs = document.querySelectorAll('body .ao-seo-tool-tab');
    if (navTabs.length) {
        navTabs[0].classList.add('ao-seo-tool-active'); // make the first tab active
        navTabs.forEach((item) => {
            item.addEventListener('click', tabClicked, false);
        });
    }

    var tabContents = document.querySelectorAll('.ao-seo-tool-tab-content');
    if (tabContents.length) {
        tabContents[0].classList.add('ao-seo-tool-active'); // make the first tab active
    }

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

    function htmlEscape(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * countValidationMessagesByType
     *
     * Returns the amount of messages by type, e.g. error, warning, success
     *
     * @param messageArrayType
     * @returns {number}
     */
    function countValidationMessagesByType(messageTypes = []) {
        if (typeof messageTypes === 'object' && messageTypes.length) {
            let count = 0;
            for(let key in validationMessages) {
                const validationCategory = validationMessages[key];
                Array.from(messageTypes).forEach((type) => {
                    count += validationCategory[type].length;
                });
            }
            return count;
        }
    }


    function countValidationMessagesByCategory() {
        // TODO
    }

    function createTabContentMarkup() {
        let markup = '';

        for (let key in validationMessages) {

            const validationCategory = validationMessages[key];

            let summaryMarkup = '';
            validationCategory.errorArray.forEach((error) => {
                summaryMarkup += createTabContentMessageSummaryMarkup(error, 'invalid');
            });
            validationCategory.warningArray.forEach((warning) => {
                summaryMarkup += createTabContentMessageSummaryMarkup(warning, 'warning');
            });
            validationCategory.successArray.forEach((success) => {
                summaryMarkup += createTabContentMessageSummaryMarkup(success, 'valid');
            });

            if (summaryMarkup.length) {
                markup += `
                <div id="ao-seo-tool-${validationCategory.tabClass}" class="ao-seo-tool-tab-content">
                    <div class="ao-seo-tool-table">
                        <div class="ao-seo-tool-table-row">
                            <div class="ao-seo-tool-table-head" style="width: 50%">
                                Item
                            </div>
                            <div class="ao-seo-tool-table-head" style="width: 50%">
                                Details
                            </div>
                        </div>
                        ${summaryMarkup}
                    </div>
                </div>
                `;
            }
        }

        return markup;
    }

    function createTabContentMessageSummaryMarkup(message, typeString) {
        let markup = '';
        markup += `
        <div class="ao-seo-tool-table-row ao-seo-tool-${typeString}">
            <div class="ao-seo-tool-table-cell">
                ${message.snippet}
            </div>
            <div class="ao-seo-tool-table-cell">
                ${message.message}
            </div>
        </div>`;

        return markup;
    }

})();