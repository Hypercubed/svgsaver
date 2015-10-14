(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SvgSaver = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Some simple utilities */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var isFunction = function isFunction(a) {
  return typeof a === 'function';
};
var isDefined = function isDefined(a) {
  return typeof a !== 'undefined';
};
var isUndefined = function isUndefined(a) {
  return typeof a === 'undefined';
};

//detection
var DownloadAttributeSupport = typeof document !== 'undefined' && 'download' in document.createElement('a');

function saveUri(uri, name) {

  if (DownloadAttributeSupport) {
    var dl = document.createElement('a');
    dl.setAttribute('href', uri);
    dl.setAttribute('download', name);
    dl.click();
    return true;
  } else if (typeof window !== 'undefined') {
    window.open(uri, '_blank', '');
    return true;
  }

  return false;
}

function savePng(uri, name) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  var image = new Image();
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    if (isDefined(window.saveAs) && isDefined(canvas.toBlob)) {
      canvas.toBlob(function (blob) {
        saveAs(blob, name);
      });
    } else {
      saveUri(canvas.toDataURL('image/png'), name);
    }
  };
  image.src = uri;
  return true;
}

// Gets computed styles for an SVG element
// adapted from https://github.com/angular/angular.js/issues/2866#issuecomment-31012434
function getComputedStyles(node) {
  if (isDefined(node.currentStyle)) {
    //for old IE
    return node.currentStyle;
  } else if (isDefined(window.getComputedStyle)) {
    //for modern browsers
    return node.ownerDocument.defaultView.getComputedStyle(node, null);
  } else {
    return node.style;
  }
}

// Vonvert computed styles to something we can iterate over
// adapted from http://stackoverflow.com/questions/754607/can-jquery-get-all-css-styles-associated-with-an-element/6416527#6416527
function convertComputedStyle(computed) {
  if (isDefined(window.getComputedStyle)) {
    var styles = {};
    for (var i = 0, l = computed.length; i < l; i++) {
      var prop = computed[i];
      var val = computed.getPropertyValue(prop);
      styles[prop] = val;
    }
    return styles;
  }
  return computed;
}

// Copies computed styles from source to target
function copyStyles(source, target, defaultStyles) {
  // styles === false - copy none, true - copy all
  if (defaultStyles === false) {
    return;
  }

  var srcStyles = getComputedStyles(source);

  if (defaultStyles === true) {
    // copy all styles
    for (var key in convertComputedStyle(srcStyles)) {
      target.style[key] = srcStyles[key];
    }
    return;
  }

  var parStyles = getComputedStyles(target.parentNode);

  for (var key in defaultStyles) {
    var src = srcStyles[key];
    if (src && src !== defaultStyles[key] && src !== parStyles[key]) {
      target.style[key] = src;
    }
  }
}

// Removes attributes that are not valid for SVGs
function cleanAttrs(el, attrs, styles) {
  // attrs === false - remove all, attrs === true - allow all
  if (attrs === true) {
    return;
  }

  Array.prototype.slice.call(el.attributes).forEach(function (attr) {
    // remove if it is not style nor on attrs  whitelist
    // keeping attributes that are also styles because attributes override
    if (attr.specified) {
      if (attrs === false || isUndefined(styles[attr.name]) && attrs.indexOf(attr.name) < 0) {
        el.removeAttribute(attr.name);
      }
    }
  });
}

// Clones an SVGElement, copyies approprate atttributes and styles.
function cloneSvg(src, attrs, styles) {
  var clonedSvg = src.cloneNode(true);
  var srcChildren = src.querySelectorAll('*');

  Array.prototype.slice.call(clonedSvg.querySelectorAll('*')).forEach(function (target, index) {
    copyStyles(srcChildren[index], target, styles);
    cleanAttrs(target, attrs, styles);
  });

  return clonedSvg;
}

var svgStyles = { // Whitelist of CSS styles and default values
  'alignment-baseline': 'auto',
  'baseline-shift': 'baseline',
  'clip': 'auto',
  'clip-path': 'none',
  'clip-rule': 'nonzero',
  'color': 'rgb(51, 51, 51)',
  'color-interpolation': 'srgb',
  'color-interpolation-filters': 'linearrgb',
  'color-profile': 'auto',
  'color-rendering': 'auto',
  'cursor': 'auto',
  'direction': 'ltr',
  'display': 'inline',
  'dominant-baseline': 'auto',
  'enable-background': '',
  'fill': 'rgb(0, 0, 0)',
  'fill-opacity': '1',
  'fill-rule': 'nonzero',
  'filter': 'none',
  'flood-color': 'rgb(0, 0, 0)',
  'flood-opacity': '1',
  'font': '',
  'font-family': 'normal',
  'font-size': 'medium',
  'font-size-adjust': 'auto',
  'font-stretch': 'normal',
  'font-style': 'normal',
  'font-variant': 'normal',
  'font-weight': '400',
  'glyph-orientation-horizontal': '0deg',
  'glyph-orientation-vertical': 'auto',
  'image-rendering': 'auto',
  'kerning': 'auto',
  'letter-spacing': '0',
  'lighting-color': 'rgb(255, 255, 255)',
  'marker': '',
  'marker-end': 'none',
  'marker-mid': 'none',
  'marker-start': 'none',
  'mask': 'none',
  'opacity': '1',
  'overflow': 'visible',
  'paint-order': 'normal',
  'pointer-events': 'auto',
  'shape-rendering': 'auto',
  'stop-color': 'rgb(0, 0, 0)',
  'stop-opacity': '1',
  'stroke': 'none',
  'stroke-dasharray': 'none',
  'stroke-dashoffset': '0',
  'stroke-linecap': 'butt',
  'stroke-linejoin': 'miter',
  'stroke-miterlimit': '4',
  'stroke-opacity': '1',
  'stroke-width': '1',
  'text-anchor': 'start',
  'text-decoration': 'none',
  'text-rendering': 'auto',
  'unicode-bidi': 'normal',
  'visibility': 'visible',
  'word-spacing': '0px',
  'writing-mode': 'lr-tb'
};

var svgAttrs = [// white list of attributes
'id', 'xml:base', 'xml:lang', 'xml:space', // Core
'height', 'result', 'width', 'x', 'y', // Primitive
'xlink:href', // Xlink attribute
'style', 'class', 'd', 'pathLength', // Path
'x', 'y', 'dx', 'dy', 'glyphRef', 'format', 'x1', 'y1', 'x2', 'y2', 'rotate', 'textLength', 'cx', 'cy', 'r', 'rx', 'ry', 'fx', 'fy', 'width', 'height', 'refX', 'refY', 'orient', 'markerUnits', 'markerWidth', 'markerHeight', 'maskUnits', 'transform', 'viewBox', 'version', // Container
'preserveAspectRatio', 'xmlns', 'points', // Polygons
'offset'];

var SvgSaver = (function () {

  /**
  * SvgSaver constructor.
  * @constructs SvgSaver
  * @api public
  *
  * @example
  * var svgsaver = new SvgSaver();                      // creates a new instance
  * var svg = document.querySelector('#mysvg');         // find the SVG element
  * svgsaver.asSvg(svg);                                // save as SVG
  */

  function SvgSaver() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var attrs = _ref.attrs;
    var styles = _ref.styles;

    _classCallCheck(this, SvgSaver);

    this.attrs = attrs === undefined ? svgAttrs : attrs;
    this.styles = styles === undefined ? svgStyles : styles;
  }

  /**
  * Return the SVG HTML text after cleaning
  *
  * @param {SVGElement} el The element to copy.
  * @returns {String} SVG text after cleaning
  * @api public
  */

  _createClass(SvgSaver, [{
    key: 'getHTML',
    value: function getHTML(el) {
      var svg = cloneSvg(el, this.attrs, this.styles);

      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('version', 1.1);

      // height and width needed to download in FireFox
      svg.setAttribute('width', svg.getAttribute('width') || '500');
      svg.setAttribute('height', svg.getAttribute('height') || '900');

      return svg.outerHTML || new window.XMLSerializer().serializeToString(svg);
    }

    /**
    * Return the SVG, after cleaning, as a text/xml Blob
    *
    * @param {SVGElement} el The element to copy.
    * @returns {Blog} SVG as a text/xml Blob
    * @api public
    */
  }, {
    key: 'getBlob',
    value: function getBlob(el) {
      var html = this.getHTML(el);
      return new Blob([html], { type: 'text/xml' });
    }

    /**
    * Return the SVG, after cleaning, as a image/svg+xml;base64 URI encoded string
    *
    * @param {SVGElement} el The element to copy.
    * @returns {String} SVG as image/svg+xml;base64 URI encoded string
    * @api public
    */
  }, {
    key: 'getUri',
    value: function getUri(el) {
      var html = this.getHTML(el);
      if (isDefined(window.btoa)) {
        return 'data:image/svg+xml;base64,' + window.btoa(html);
      }
      return 'data:image/svg+xml,' + encodeURIComponent(html);
    }

    /**
    * Saves the SVG as a SVG file using method compatible with the browser
    *
    * @param {SVGElement} el The element to copy.
    * @param {string} [filename] The filename to save, defaults to the SVG title or 'untitled.svg'
    * @returns {SvgSaver} The SvgSaver instance
    * @api public
    */
  }, {
    key: 'asSvg',
    value: function asSvg(el, filename) {
      if (!filename || filename === '') {
        filename = el.getAttribute('title');
        filename = (filename || 'untitled') + '.svg';
      }
      if (isDefined(window.saveAs) && isFunction(Blob)) {
        return saveAs(this.getBlob(el), filename);
      } else {
        return saveUri(this.getUri(el), filename);
      }
    }

    /**
    * Saves the SVG as a PNG file using method compatible with the browser
    *
    * @param {SVGElement} el The element to copy.
    * @param {string} [filename] The filename to save, defaults to the SVG title or 'untitled.png'
    * @returns {SvgSaver} The SvgSaver instance
    * @api public
    */
  }, {
    key: 'asPng',
    value: function asPng(el, filename) {
      if (!filename || filename === '') {
        filename = el.getAttribute('title');
        filename = (filename || 'untitled') + '.png';
      }
      return savePng(this.getUri(el), filename);
    }
  }]);

  return SvgSaver;
})();

exports['default'] = SvgSaver;
module.exports = exports['default'];

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvc3Znc2F2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFNvbWUgc2ltcGxlIHV0aWxpdGllcyAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbiBpc0Z1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIHR5cGVvZiBhID09PSAnZnVuY3Rpb24nO1xufTtcbnZhciBpc0RlZmluZWQgPSBmdW5jdGlvbiBpc0RlZmluZWQoYSkge1xuICByZXR1cm4gdHlwZW9mIGEgIT09ICd1bmRlZmluZWQnO1xufTtcbnZhciBpc1VuZGVmaW5lZCA9IGZ1bmN0aW9uIGlzVW5kZWZpbmVkKGEpIHtcbiAgcmV0dXJuIHR5cGVvZiBhID09PSAndW5kZWZpbmVkJztcbn07XG5cbi8vZGV0ZWN0aW9uXG52YXIgRG93bmxvYWRBdHRyaWJ1dGVTdXBwb3J0ID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiAnZG93bmxvYWQnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblxuZnVuY3Rpb24gc2F2ZVVyaSh1cmksIG5hbWUpIHtcblxuICBpZiAoRG93bmxvYWRBdHRyaWJ1dGVTdXBwb3J0KSB7XG4gICAgdmFyIGRsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGRsLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVyaSk7XG4gICAgZGwuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIG5hbWUpO1xuICAgIGRsLmNsaWNrKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB3aW5kb3cub3Blbih1cmksICdfYmxhbmsnLCAnJyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHNhdmVQbmcodXJpLCBuYW1lKSB7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGNhbnZhcy53aWR0aCA9IGltYWdlLndpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDApO1xuXG4gICAgaWYgKGlzRGVmaW5lZCh3aW5kb3cuc2F2ZUFzKSAmJiBpc0RlZmluZWQoY2FudmFzLnRvQmxvYikpIHtcbiAgICAgIGNhbnZhcy50b0Jsb2IoZnVuY3Rpb24gKGJsb2IpIHtcbiAgICAgICAgc2F2ZUFzKGJsb2IsIG5hbWUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNhdmVVcmkoY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJyksIG5hbWUpO1xuICAgIH1cbiAgfTtcbiAgaW1hZ2Uuc3JjID0gdXJpO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gR2V0cyBjb21wdXRlZCBzdHlsZXMgZm9yIGFuIFNWRyBlbGVtZW50XG4vLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9pc3N1ZXMvMjg2NiNpc3N1ZWNvbW1lbnQtMzEwMTI0MzRcbmZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGVzKG5vZGUpIHtcbiAgaWYgKGlzRGVmaW5lZChub2RlLmN1cnJlbnRTdHlsZSkpIHtcbiAgICAvL2ZvciBvbGQgSUVcbiAgICByZXR1cm4gbm9kZS5jdXJyZW50U3R5bGU7XG4gIH0gZWxzZSBpZiAoaXNEZWZpbmVkKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSkge1xuICAgIC8vZm9yIG1vZGVybiBicm93c2Vyc1xuICAgIHJldHVybiBub2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZTtcbiAgfVxufVxuXG4vLyBWb252ZXJ0IGNvbXB1dGVkIHN0eWxlcyB0byBzb21ldGhpbmcgd2UgY2FuIGl0ZXJhdGUgb3ZlclxuLy8gYWRhcHRlZCBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzU0NjA3L2Nhbi1qcXVlcnktZ2V0LWFsbC1jc3Mtc3R5bGVzLWFzc29jaWF0ZWQtd2l0aC1hbi1lbGVtZW50LzY0MTY1MjcjNjQxNjUyN1xuZnVuY3Rpb24gY29udmVydENvbXB1dGVkU3R5bGUoY29tcHV0ZWQpIHtcbiAgaWYgKGlzRGVmaW5lZCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkpIHtcbiAgICB2YXIgc3R5bGVzID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjb21wdXRlZC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBwcm9wID0gY29tcHV0ZWRbaV07XG4gICAgICB2YXIgdmFsID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbiAgICAgIHN0eWxlc1twcm9wXSA9IHZhbDtcbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxuICByZXR1cm4gY29tcHV0ZWQ7XG59XG5cbi8vIENvcGllcyBjb21wdXRlZCBzdHlsZXMgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0XG5mdW5jdGlvbiBjb3B5U3R5bGVzKHNvdXJjZSwgdGFyZ2V0LCBkZWZhdWx0U3R5bGVzKSB7XG4gIC8vIHN0eWxlcyA9PT0gZmFsc2UgLSBjb3B5IG5vbmUsIHRydWUgLSBjb3B5IGFsbFxuICBpZiAoZGVmYXVsdFN0eWxlcyA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgc3JjU3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZXMoc291cmNlKTtcblxuICBpZiAoZGVmYXVsdFN0eWxlcyA9PT0gdHJ1ZSkge1xuICAgIC8vIGNvcHkgYWxsIHN0eWxlc1xuICAgIGZvciAodmFyIGtleSBpbiBjb252ZXJ0Q29tcHV0ZWRTdHlsZShzcmNTdHlsZXMpKSB7XG4gICAgICB0YXJnZXQuc3R5bGVba2V5XSA9IHNyY1N0eWxlc1trZXldO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcGFyU3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZXModGFyZ2V0LnBhcmVudE5vZGUpO1xuXG4gIGZvciAodmFyIGtleSBpbiBkZWZhdWx0U3R5bGVzKSB7XG4gICAgdmFyIHNyYyA9IHNyY1N0eWxlc1trZXldO1xuICAgIGlmIChzcmMgJiYgc3JjICE9PSBkZWZhdWx0U3R5bGVzW2tleV0gJiYgc3JjICE9PSBwYXJTdHlsZXNba2V5XSkge1xuICAgICAgdGFyZ2V0LnN0eWxlW2tleV0gPSBzcmM7XG4gICAgfVxuICB9XG59XG5cbi8vIFJlbW92ZXMgYXR0cmlidXRlcyB0aGF0IGFyZSBub3QgdmFsaWQgZm9yIFNWR3NcbmZ1bmN0aW9uIGNsZWFuQXR0cnMoZWwsIGF0dHJzLCBzdHlsZXMpIHtcbiAgLy8gYXR0cnMgPT09IGZhbHNlIC0gcmVtb3ZlIGFsbCwgYXR0cnMgPT09IHRydWUgLSBhbGxvdyBhbGxcbiAgaWYgKGF0dHJzID09PSB0cnVlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZWwuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgIC8vIHJlbW92ZSBpZiBpdCBpcyBub3Qgc3R5bGUgbm9yIG9uIGF0dHJzICB3aGl0ZWxpc3RcbiAgICAvLyBrZWVwaW5nIGF0dHJpYnV0ZXMgdGhhdCBhcmUgYWxzbyBzdHlsZXMgYmVjYXVzZSBhdHRyaWJ1dGVzIG92ZXJyaWRlXG4gICAgaWYgKGF0dHIuc3BlY2lmaWVkKSB7XG4gICAgICBpZiAoYXR0cnMgPT09IGZhbHNlIHx8IGlzVW5kZWZpbmVkKHN0eWxlc1thdHRyLm5hbWVdKSAmJiBhdHRycy5pbmRleE9mKGF0dHIubmFtZSkgPCAwKSB7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbi8vIENsb25lcyBhbiBTVkdFbGVtZW50LCBjb3B5aWVzIGFwcHJvcHJhdGUgYXR0dHJpYnV0ZXMgYW5kIHN0eWxlcy5cbmZ1bmN0aW9uIGNsb25lU3ZnKHNyYywgYXR0cnMsIHN0eWxlcykge1xuICB2YXIgY2xvbmVkU3ZnID0gc3JjLmNsb25lTm9kZSh0cnVlKTtcbiAgdmFyIHNyY0NoaWxkcmVuID0gc3JjLnF1ZXJ5U2VsZWN0b3JBbGwoJyonKTtcblxuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChjbG9uZWRTdmcucXVlcnlTZWxlY3RvckFsbCgnKicpKS5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXQsIGluZGV4KSB7XG4gICAgY29weVN0eWxlcyhzcmNDaGlsZHJlbltpbmRleF0sIHRhcmdldCwgc3R5bGVzKTtcbiAgICBjbGVhbkF0dHJzKHRhcmdldCwgYXR0cnMsIHN0eWxlcyk7XG4gIH0pO1xuXG4gIHJldHVybiBjbG9uZWRTdmc7XG59XG5cbnZhciBzdmdTdHlsZXMgPSB7IC8vIFdoaXRlbGlzdCBvZiBDU1Mgc3R5bGVzIGFuZCBkZWZhdWx0IHZhbHVlc1xuICAnYWxpZ25tZW50LWJhc2VsaW5lJzogJ2F1dG8nLFxuICAnYmFzZWxpbmUtc2hpZnQnOiAnYmFzZWxpbmUnLFxuICAnY2xpcCc6ICdhdXRvJyxcbiAgJ2NsaXAtcGF0aCc6ICdub25lJyxcbiAgJ2NsaXAtcnVsZSc6ICdub256ZXJvJyxcbiAgJ2NvbG9yJzogJ3JnYig1MSwgNTEsIDUxKScsXG4gICdjb2xvci1pbnRlcnBvbGF0aW9uJzogJ3NyZ2InLFxuICAnY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzJzogJ2xpbmVhcnJnYicsXG4gICdjb2xvci1wcm9maWxlJzogJ2F1dG8nLFxuICAnY29sb3ItcmVuZGVyaW5nJzogJ2F1dG8nLFxuICAnY3Vyc29yJzogJ2F1dG8nLFxuICAnZGlyZWN0aW9uJzogJ2x0cicsXG4gICdkaXNwbGF5JzogJ2lubGluZScsXG4gICdkb21pbmFudC1iYXNlbGluZSc6ICdhdXRvJyxcbiAgJ2VuYWJsZS1iYWNrZ3JvdW5kJzogJycsXG4gICdmaWxsJzogJ3JnYigwLCAwLCAwKScsXG4gICdmaWxsLW9wYWNpdHknOiAnMScsXG4gICdmaWxsLXJ1bGUnOiAnbm9uemVybycsXG4gICdmaWx0ZXInOiAnbm9uZScsXG4gICdmbG9vZC1jb2xvcic6ICdyZ2IoMCwgMCwgMCknLFxuICAnZmxvb2Qtb3BhY2l0eSc6ICcxJyxcbiAgJ2ZvbnQnOiAnJyxcbiAgJ2ZvbnQtZmFtaWx5JzogJ25vcm1hbCcsXG4gICdmb250LXNpemUnOiAnbWVkaXVtJyxcbiAgJ2ZvbnQtc2l6ZS1hZGp1c3QnOiAnYXV0bycsXG4gICdmb250LXN0cmV0Y2gnOiAnbm9ybWFsJyxcbiAgJ2ZvbnQtc3R5bGUnOiAnbm9ybWFsJyxcbiAgJ2ZvbnQtdmFyaWFudCc6ICdub3JtYWwnLFxuICAnZm9udC13ZWlnaHQnOiAnNDAwJyxcbiAgJ2dseXBoLW9yaWVudGF0aW9uLWhvcml6b250YWwnOiAnMGRlZycsXG4gICdnbHlwaC1vcmllbnRhdGlvbi12ZXJ0aWNhbCc6ICdhdXRvJyxcbiAgJ2ltYWdlLXJlbmRlcmluZyc6ICdhdXRvJyxcbiAgJ2tlcm5pbmcnOiAnYXV0bycsXG4gICdsZXR0ZXItc3BhY2luZyc6ICcwJyxcbiAgJ2xpZ2h0aW5nLWNvbG9yJzogJ3JnYigyNTUsIDI1NSwgMjU1KScsXG4gICdtYXJrZXInOiAnJyxcbiAgJ21hcmtlci1lbmQnOiAnbm9uZScsXG4gICdtYXJrZXItbWlkJzogJ25vbmUnLFxuICAnbWFya2VyLXN0YXJ0JzogJ25vbmUnLFxuICAnbWFzayc6ICdub25lJyxcbiAgJ29wYWNpdHknOiAnMScsXG4gICdvdmVyZmxvdyc6ICd2aXNpYmxlJyxcbiAgJ3BhaW50LW9yZGVyJzogJ25vcm1hbCcsXG4gICdwb2ludGVyLWV2ZW50cyc6ICdhdXRvJyxcbiAgJ3NoYXBlLXJlbmRlcmluZyc6ICdhdXRvJyxcbiAgJ3N0b3AtY29sb3InOiAncmdiKDAsIDAsIDApJyxcbiAgJ3N0b3Atb3BhY2l0eSc6ICcxJyxcbiAgJ3N0cm9rZSc6ICdub25lJyxcbiAgJ3N0cm9rZS1kYXNoYXJyYXknOiAnbm9uZScsXG4gICdzdHJva2UtZGFzaG9mZnNldCc6ICcwJyxcbiAgJ3N0cm9rZS1saW5lY2FwJzogJ2J1dHQnLFxuICAnc3Ryb2tlLWxpbmVqb2luJzogJ21pdGVyJyxcbiAgJ3N0cm9rZS1taXRlcmxpbWl0JzogJzQnLFxuICAnc3Ryb2tlLW9wYWNpdHknOiAnMScsXG4gICdzdHJva2Utd2lkdGgnOiAnMScsXG4gICd0ZXh0LWFuY2hvcic6ICdzdGFydCcsXG4gICd0ZXh0LWRlY29yYXRpb24nOiAnbm9uZScsXG4gICd0ZXh0LXJlbmRlcmluZyc6ICdhdXRvJyxcbiAgJ3VuaWNvZGUtYmlkaSc6ICdub3JtYWwnLFxuICAndmlzaWJpbGl0eSc6ICd2aXNpYmxlJyxcbiAgJ3dvcmQtc3BhY2luZyc6ICcwcHgnLFxuICAnd3JpdGluZy1tb2RlJzogJ2xyLXRiJ1xufTtcblxudmFyIHN2Z0F0dHJzID0gWy8vIHdoaXRlIGxpc3Qgb2YgYXR0cmlidXRlc1xuJ2lkJywgJ3htbDpiYXNlJywgJ3htbDpsYW5nJywgJ3htbDpzcGFjZScsIC8vIENvcmVcbidoZWlnaHQnLCAncmVzdWx0JywgJ3dpZHRoJywgJ3gnLCAneScsIC8vIFByaW1pdGl2ZVxuJ3hsaW5rOmhyZWYnLCAvLyBYbGluayBhdHRyaWJ1dGVcbidzdHlsZScsICdjbGFzcycsICdkJywgJ3BhdGhMZW5ndGgnLCAvLyBQYXRoXG4neCcsICd5JywgJ2R4JywgJ2R5JywgJ2dseXBoUmVmJywgJ2Zvcm1hdCcsICd4MScsICd5MScsICd4MicsICd5MicsICdyb3RhdGUnLCAndGV4dExlbmd0aCcsICdjeCcsICdjeScsICdyJywgJ3J4JywgJ3J5JywgJ2Z4JywgJ2Z5JywgJ3dpZHRoJywgJ2hlaWdodCcsICdyZWZYJywgJ3JlZlknLCAnb3JpZW50JywgJ21hcmtlclVuaXRzJywgJ21hcmtlcldpZHRoJywgJ21hcmtlckhlaWdodCcsICdtYXNrVW5pdHMnLCAndHJhbnNmb3JtJywgJ3ZpZXdCb3gnLCAndmVyc2lvbicsIC8vIENvbnRhaW5lclxuJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneG1sbnMnLCAncG9pbnRzJywgLy8gUG9seWdvbnNcbidvZmZzZXQnXTtcblxudmFyIFN2Z1NhdmVyID0gKGZ1bmN0aW9uICgpIHtcblxuICAvKipcbiAgKiBTdmdTYXZlciBjb25zdHJ1Y3Rvci5cbiAgKiBAY29uc3RydWN0cyBTdmdTYXZlclxuICAqIEBhcGkgcHVibGljXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHZhciBzdmdzYXZlciA9IG5ldyBTdmdTYXZlcigpOyAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGVzIGEgbmV3IGluc3RhbmNlXG4gICogdmFyIHN2ZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNteXN2ZycpOyAgICAgICAgIC8vIGZpbmQgdGhlIFNWRyBlbGVtZW50XG4gICogc3Znc2F2ZXIuYXNTdmcoc3ZnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgYXMgU1ZHXG4gICovXG5cbiAgZnVuY3Rpb24gU3ZnU2F2ZXIoKSB7XG4gICAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuICAgIHZhciBhdHRycyA9IF9yZWYuYXR0cnM7XG4gICAgdmFyIHN0eWxlcyA9IF9yZWYuc3R5bGVzO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFN2Z1NhdmVyKTtcblxuICAgIHRoaXMuYXR0cnMgPSBhdHRycyA9PT0gdW5kZWZpbmVkID8gc3ZnQXR0cnMgOiBhdHRycztcbiAgICB0aGlzLnN0eWxlcyA9IHN0eWxlcyA9PT0gdW5kZWZpbmVkID8gc3ZnU3R5bGVzIDogc3R5bGVzO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJuIHRoZSBTVkcgSFRNTCB0ZXh0IGFmdGVyIGNsZWFuaW5nXG4gICpcbiAgKiBAcGFyYW0ge1NWR0VsZW1lbnR9IGVsIFRoZSBlbGVtZW50IHRvIGNvcHkuXG4gICogQHJldHVybnMge1N0cmluZ30gU1ZHIHRleHQgYWZ0ZXIgY2xlYW5pbmdcbiAgKiBAYXBpIHB1YmxpY1xuICAqL1xuXG4gIF9jcmVhdGVDbGFzcyhTdmdTYXZlciwgW3tcbiAgICBrZXk6ICdnZXRIVE1MJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SFRNTChlbCkge1xuICAgICAgdmFyIHN2ZyA9IGNsb25lU3ZnKGVsLCB0aGlzLmF0dHJzLCB0aGlzLnN0eWxlcyk7XG5cbiAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyk7XG4gICAgICBzdmcuc2V0QXR0cmlidXRlKCd2ZXJzaW9uJywgMS4xKTtcblxuICAgICAgLy8gaGVpZ2h0IGFuZCB3aWR0aCBuZWVkZWQgdG8gZG93bmxvYWQgaW4gRmlyZUZveFxuICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzdmcuZ2V0QXR0cmlidXRlKCd3aWR0aCcpIHx8ICc1MDAnKTtcbiAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHN2Zy5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpIHx8ICc5MDAnKTtcblxuICAgICAgcmV0dXJuIHN2Zy5vdXRlckhUTUwgfHwgbmV3IHdpbmRvdy5YTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcoc3ZnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFJldHVybiB0aGUgU1ZHLCBhZnRlciBjbGVhbmluZywgYXMgYSB0ZXh0L3htbCBCbG9iXG4gICAgKlxuICAgICogQHBhcmFtIHtTVkdFbGVtZW50fSBlbCBUaGUgZWxlbWVudCB0byBjb3B5LlxuICAgICogQHJldHVybnMge0Jsb2d9IFNWRyBhcyBhIHRleHQveG1sIEJsb2JcbiAgICAqIEBhcGkgcHVibGljXG4gICAgKi9cbiAgfSwge1xuICAgIGtleTogJ2dldEJsb2InLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRCbG9iKGVsKSB7XG4gICAgICB2YXIgaHRtbCA9IHRoaXMuZ2V0SFRNTChlbCk7XG4gICAgICByZXR1cm4gbmV3IEJsb2IoW2h0bWxdLCB7IHR5cGU6ICd0ZXh0L3htbCcgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBSZXR1cm4gdGhlIFNWRywgYWZ0ZXIgY2xlYW5pbmcsIGFzIGEgaW1hZ2Uvc3ZnK3htbDtiYXNlNjQgVVJJIGVuY29kZWQgc3RyaW5nXG4gICAgKlxuICAgICogQHBhcmFtIHtTVkdFbGVtZW50fSBlbCBUaGUgZWxlbWVudCB0byBjb3B5LlxuICAgICogQHJldHVybnMge1N0cmluZ30gU1ZHIGFzIGltYWdlL3N2Zyt4bWw7YmFzZTY0IFVSSSBlbmNvZGVkIHN0cmluZ1xuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB9LCB7XG4gICAga2V5OiAnZ2V0VXJpJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VXJpKGVsKSB7XG4gICAgICB2YXIgaHRtbCA9IHRoaXMuZ2V0SFRNTChlbCk7XG4gICAgICBpZiAoaXNEZWZpbmVkKHdpbmRvdy5idG9hKSkge1xuICAgICAgICByZXR1cm4gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJyArIHdpbmRvdy5idG9hKGh0bWwpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdkYXRhOmltYWdlL3N2Zyt4bWwsJyArIGVuY29kZVVSSUNvbXBvbmVudChodG1sKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFNhdmVzIHRoZSBTVkcgYXMgYSBTVkcgZmlsZSB1c2luZyBtZXRob2QgY29tcGF0aWJsZSB3aXRoIHRoZSBicm93c2VyXG4gICAgKlxuICAgICogQHBhcmFtIHtTVkdFbGVtZW50fSBlbCBUaGUgZWxlbWVudCB0byBjb3B5LlxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtmaWxlbmFtZV0gVGhlIGZpbGVuYW1lIHRvIHNhdmUsIGRlZmF1bHRzIHRvIHRoZSBTVkcgdGl0bGUgb3IgJ3VudGl0bGVkLnN2ZydcbiAgICAqIEByZXR1cm5zIHtTdmdTYXZlcn0gVGhlIFN2Z1NhdmVyIGluc3RhbmNlXG4gICAgKiBAYXBpIHB1YmxpY1xuICAgICovXG4gIH0sIHtcbiAgICBrZXk6ICdhc1N2ZycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFzU3ZnKGVsLCBmaWxlbmFtZSkge1xuICAgICAgaWYgKCFmaWxlbmFtZSB8fCBmaWxlbmFtZSA9PT0gJycpIHtcbiAgICAgICAgZmlsZW5hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XG4gICAgICAgIGZpbGVuYW1lID0gKGZpbGVuYW1lIHx8ICd1bnRpdGxlZCcpICsgJy5zdmcnO1xuICAgICAgfVxuICAgICAgaWYgKGlzRGVmaW5lZCh3aW5kb3cuc2F2ZUFzKSAmJiBpc0Z1bmN0aW9uKEJsb2IpKSB7XG4gICAgICAgIHJldHVybiBzYXZlQXModGhpcy5nZXRCbG9iKGVsKSwgZmlsZW5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNhdmVVcmkodGhpcy5nZXRVcmkoZWwpLCBmaWxlbmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBTYXZlcyB0aGUgU1ZHIGFzIGEgUE5HIGZpbGUgdXNpbmcgbWV0aG9kIGNvbXBhdGlibGUgd2l0aCB0aGUgYnJvd3NlclxuICAgICpcbiAgICAqIEBwYXJhbSB7U1ZHRWxlbWVudH0gZWwgVGhlIGVsZW1lbnQgdG8gY29weS5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbZmlsZW5hbWVdIFRoZSBmaWxlbmFtZSB0byBzYXZlLCBkZWZhdWx0cyB0byB0aGUgU1ZHIHRpdGxlIG9yICd1bnRpdGxlZC5wbmcnXG4gICAgKiBAcmV0dXJucyB7U3ZnU2F2ZXJ9IFRoZSBTdmdTYXZlciBpbnN0YW5jZVxuICAgICogQGFwaSBwdWJsaWNcbiAgICAqL1xuICB9LCB7XG4gICAga2V5OiAnYXNQbmcnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhc1BuZyhlbCwgZmlsZW5hbWUpIHtcbiAgICAgIGlmICghZmlsZW5hbWUgfHwgZmlsZW5hbWUgPT09ICcnKSB7XG4gICAgICAgIGZpbGVuYW1lID0gZWwuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xuICAgICAgICBmaWxlbmFtZSA9IChmaWxlbmFtZSB8fCAndW50aXRsZWQnKSArICcucG5nJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzYXZlUG5nKHRoaXMuZ2V0VXJpKGVsKSwgZmlsZW5hbWUpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTdmdTYXZlcjtcbn0pKCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFN2Z1NhdmVyO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107XG4iXX0=
