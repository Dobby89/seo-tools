# SEO Tool

A simple Google Chrome extension which validates the HTML markup against the following conditions:

* The `title` tag must be between 55-60 characters in length
* The meta description [must be below 300 characters in length](https://moz.com/blog/how-long-should-your-meta-description-be-2018)
* There must only be one `h1` tag on the page
* Header tags (`h1, h2, h3`...) must be used chronologically, e.g.
  * A `h3` tag must not be used unless a `h2` tag has been used
  * A `h4` tag must not be used unless a `h3` tag has been used
  * A `h6` tag must not be used unless a `h5` tag has been used
* All `img` tags must have an `alt` attribute

## Screenshot

![SEO Tool example](http://drive.google.com/uc?export=view&id=1XEwxZ8wNgQbFm9q8Xtpbo3bleG_3ihJW "SEO Tool example")

## Set up

* Clone the repo (or download and unzip)
* Open Chrome -> More tools -> Extensions
* Load unpacked extension -> point to folder containing the files
* Click the ![Extension icon](http://drive.google.com/uc?export=view&id=1Qr6RHrxx9R_k4ABzuiyoOtN45hVAhDQd "Extension icon") icon on your browser to run!
