# svgsaver

Download an SVG element as an SVG or PNG file, including CSS defined styles.

[![NPM version][npm-badge]][npm]
[![Downloads][download-badge]][npm]
![Downloads][bower-badge]

[![Build Status][travis-image]][travis-url]
[![Codacy Badge][codacy-badge]][Codacy]

[![js-semistandard-style][standard-badge]][semistandard]
[![License][license-badge]][MIT License]

## Features
- Download `<svg>` by element object.
- Download as SVG or PNG file.
- Copies SVG element styles as rendered in the browser, including styles defined in CSS style sheets.
- Copies only SVG relevant and non-default styles.  [See here](http://www.w3.org/TR/SVG/propidx.html).
- Computed styles are in-lined for maximum compatibility.

## Install

### Node

```js
npm install svgsaver
```

### Bower

```js
bower install svgsaver
```

### JSPM

```js
jspm install svgsaver=npm:svgsaver
```

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
[MIT License]

[npm]: https://npmjs.org/package/svgsaver
[bower]: https://npmjs.org/package/svgsaver
[semistandard]: https://github.com/Flet/semistandard
[Codacy]: https://www.codacy.com/app/hypercubed/svgsaver
[MIT License]: http://en.wikipedia.org/wiki/MIT_License
[travis-url]: https://travis-ci.org/Hypercubed/svgsaver

[travis-image]: https://img.shields.io/travis/Hypercubed/svgsaver.svg
[npm-badge]: https://img.shields.io/npm/v/svgsaver.svg
[bower-badge]: https://img.shields.io/bower/v/svgsaver.svg
[standard-badge]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg
[download-badge]: http://img.shields.io/npm/dm/svgsaver.svg
[codacy-badge]: https://api.codacy.com/project/badge/6fe47dae30b34d2da78572b3ea36cfe0
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
