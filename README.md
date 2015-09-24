svgsaver
===

download an svg element as an SVG file, including CSS defined styles.

## Features
- Download `<svg>` by element object or css selectors.
- Copies SVG element styles as rendered in the browser, including styles defined in CSS stylesheets.
- Copies only SVG relevant and non-default styles.  [See here](http://www.w3.org/TR/SVG/propidx.html).

## Usage

*Currently requires a global version of [eligrey/FileSaver.js/](https://github.com/eligrey/FileSaver.js)*.

### Example

```
var SvgSaver = require('svgsaver');                 // if using CommonJS environment
var svgsaver = new SvgSaver();                      // creates a new instance
var octocat = document.querySelector('#octocat');   // find the SVG element
svgsaver.asSvg(octocat);                            // save as SVG
```

## Acknowledgments
Based on previous work on [Hypercubed/angular-downloadsvg-directive](https://github.com/Hypercubed/angular-downloadsvg-directive).  Some portions of this directive inspired by code from [raw](https://github.com/densitydesign/raw/blob/master/js/directives.js) and [moagrius/copycss](https://github.com/moagrius/copycss).

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
