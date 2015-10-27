# svgsaver

Download an SVG element as an SVG or PNG file, including CSS defined styles.

[![NPM version][npm-image]][npm-url]
[![Downloads][download-badge]][npm-url]

## Features
- Download `<svg>` by element object.
- Downlad as SVG of PNG file.
- Copies SVG element styles as rendered in the browser, including styles defined in CSS style sheets.
- Copies only SVG relevant and non-default styles.  [See here](http://www.w3.org/TR/SVG/propidx.html).
- Computed styles are inlined for maximum compatibility.

## Install

### Node

npm install svgsaver

### Bower

bower install svgsaver

### JSPM

jspm install svgsaver=npm:svgsaver

## Usage

*For maximum compatibility across browsers include [eligrey/FileSaver.js/](https://github.com/eligrey/FileSaver.js) and [eligrey/canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js). See [Compatibility-Chart](https://github.com/Hypercubed/svgsaver/wiki/Compatibility-Chart) for more information.*

### Example

```
var SvgSaver = require('svgsaver');                 // if using CommonJS environment
var svgsaver = new SvgSaver();                      // creates a new instance
var svg = document.querySelector('#mysvg');         // find the SVG element
svgsaver.asSvg(svg);                                // save as SVG
```

### Demos

- [Epicyclic Gearing](http://bl.ocks.org/Hypercubed/db9e99d761f90d87cf43) - d3
- [Superformula Explorer](http://bl.ocks.org/Hypercubed/58fff7215e53d6565f32) - d3
- [City Construction Site](http://codepen.io/Hypercubed/pen/OyWadQ) - jQuery and TweenMax
- [Chiasm Boilerplate (with download buttons)](http://bl.ocks.org/Hypercubed/b01a767b41b0e679aade) - Chiasm

## Acknowledgments
Based on previous work on [Hypercubed/angular-downloadsvg-directive](https://github.com/Hypercubed/angular-downloadsvg-directive).  Some portions of this code inspired by [raw](https://github.com/densitydesign/raw/blob/master/js/directives.js) and [moagrius/copycss](https://github.com/moagrius/copycss).

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
