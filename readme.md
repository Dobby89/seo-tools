# Spec

* As a UAT Analyst, I want a standalone tool that I can enter a URL into that will then run a series of tests against that page.
* The tool should be able to be run against our live websites, as well as all testing environments (canary, beta, staging).
* Things that the tool will check are:
⋅⋅i. The title tag is between 55-60 characters in length
⋅⋅ii. The meta description is below 160 characters
⋅⋅iii. There is only one H1 tag on the page
⋅⋅iv. Headers follow a consistent structure (H1,H2,H3)
⋅⋅v. All images have img alt text
⋅⋅vi. All images have Image Title

# Set up

open chrome - more tools - extensions
load unpacked extension - point to folder containing these files