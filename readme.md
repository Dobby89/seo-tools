# Spec

* As a UAT Analyst, I want a standalone tool that I can enter a URL into that will then run a series of tests against that page.
* The tool should be able to be run against our live websites, as well as all testing environments (canary, beta, staging).
* Things that the tool will check are:
⋅⋅1. The title tag is between 55-60 characters in length
⋅⋅2. The meta description is below 160 characters
⋅⋅3. There is only one H1 tag on the page
⋅⋅4. Headers follow a consistent structure (H1,H2,H3)
⋅⋅5. All images have img alt text
⋅⋅6. All images have Image Title

# Styles

Upload to CDN, update query string within inject.js to pull latest

# Set up

* Open chrome -> more tools -> extensions
* Load unpacked extension -> point to folder containing these files
* Click the icon on your browser to run!