'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _computedStyles = require('computed-styles');

var _computedStyles2 = _interopRequireDefault(_computedStyles);

var _fileSaver = require('file-saver');

var _fileSaver2 = _interopRequireDefault(_fileSaver);

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
  'paint-order': 'fill',
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
'id', 'xml: base', 'xml: lang', 'xml: space', // Core
'height', 'result', 'width', 'x', 'y', // Primitive
'xlink: href', // Xlink attribute
'href', 'style', 'class', 'd', 'pathLength', // Path
'x', 'y', 'dx', 'dy', 'glyphRef', 'format', 'x1', 'y1', 'x2', 'y2', 'rotate', 'textLength', 'cx', 'cy', 'r', 'rx', 'ry', 'fx', 'fy', 'width', 'height', 'refX', 'refY', 'orient', 'markerUnits', 'markerWidth', 'markerHeight', 'maskUnits', 'transform', 'viewBox', 'version', // Container
'preserveAspectRatio', 'xmlns', 'points', // Polygons
'offset', 'xlink:href'];

// http://www.w3.org/TR/SVG/propidx.html
// via https://github.com/svg/svgo/blob/master/plugins/_collections.js
var inheritableAttrs = ['clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cursor', 'direction', 'fill', 'fill-opacity', 'fill-rule', 'font', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-orientation-horizontal', 'glyph-orientation-vertical', 'image-rendering', 'kerning', 'letter-spacing', 'marker', 'marker-end', 'marker-mid', 'marker-start', 'pointer-events', 'shape-rendering', 'stroke', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'text-anchor', 'text-rendering', 'transform', 'visibility', 'white-space', 'word-spacing', 'writing-mode'];

/* Some simple utilities */

var isFunction = function isFunction(a) {
  return typeof a === 'function';
};
var isDefined = function isDefined(a) {
  return typeof a !== 'undefined';
};
var isUndefined = function isUndefined(a) {
  return typeof a === 'undefined';
};
var isObject = function isObject(a) {
  return a !== null && typeof a === 'object';
};

// from https://github.com/npm-dom/is-dom/blob/master/index.js
function isNode(val) {
  if (!isObject(val)) {
    return false;
  }
  if (isDefined(window) && isObject(window.Node)) {
    return val instanceof window.Node;
  }
  return typeof val.nodeType === 'number' && typeof val.nodeName === 'string';
}

/* Some utilities for cloning SVGs with inline styles */
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
      if (attrs === '' || attrs === false || isUndefined(styles[attr.name]) && attrs.indexOf(attr.name) < 0) {
        el.removeAttribute(attr.name);
      }
    }
  });
}

function cleanStyle(tgt, parentStyles) {
  parentStyles = parentStyles || tgt.parentNode.style;
  inheritableAttrs.forEach(function (key) {
    if (tgt.style[key] === parentStyles[key]) {
      tgt.style.removeProperty(key);
    }
  });
}

function domWalk(src, tgt, down, up) {
  down(src, tgt);
  var children = src.childNodes;
  for (var i = 0; i < children.length; i++) {
    domWalk(children[i], tgt.childNodes[i], down, up);
  }
  up(src, tgt);
}

// Clones an SVGElement, copies approprate atttributes and styles.
function cloneSvg(src, attrs, styles) {
  var clonedSvg = src.cloneNode(true);

  domWalk(src, clonedSvg, function (src, tgt) {
    if (tgt.style) {
      (0, _computedStyles2['default'])(src, tgt.style, styles);
    }
  }, function (src, tgt) {
    if (tgt.style && tgt.parentNode) {
      cleanStyle(tgt);
    }
    if (tgt.attributes) {
      cleanAttrs(tgt, attrs, styles);
    }
  });

  return clonedSvg;
}

/* global Image, MouseEvent */

/* Some simple utilities for saving SVGs, including an alternative to saveAs */

// detection
var DownloadAttributeSupport = typeof document !== 'undefined' && 'download' in document.createElement('a') && typeof MouseEvent === 'function';

function saveUri(uri, name) {
  if (DownloadAttributeSupport) {
    var dl = document.createElement('a');
    dl.setAttribute('href', uri);
    dl.setAttribute('download', name);
    // firefox doesn't support `.click()`...
    // from https://github.com/sindresorhus/multi-download/blob/gh-pages/index.js
    dl.dispatchEvent(new MouseEvent('click'));
    return true;
  } else if (typeof window !== 'undefined') {
    window.open(uri, '_blank', '');
    return true;
  }

  return false;
}

function createCanvas(uri, name, cb) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  var image = new Image();
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    cb(canvas);
  };
  image.src = uri;
  return true;
}

function savePng(uri, name) {
  return createCanvas(uri, name, function (canvas) {
    if (isDefined(canvas.toBlob)) {
      canvas.toBlob(function (blob) {
        _fileSaver2['default'].saveAs(blob, name);
      });
    } else {
      saveUri(canvas.toDataURL('image/png'), name);
    }
  });
}

/* global Blob */

var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

// inheritable styles may be overridden by parent, always copy for now
inheritableAttrs.forEach(function (k) {
  if (k in svgStyles) {
    svgStyles[k] = true;
  }
});

var SvgSaver = (function () {
  _createClass(SvgSaver, null, [{
    key: 'getSvg',
    value: function getSvg(el) {
      if (isUndefined(el) || el === '') {
        el = document.body.querySelector('svg');
      } else if (typeof el === 'string') {
        el = document.body.querySelector(el);
      }
      if (el && el.tagName !== 'svg') {
        el = el.querySelector('svg');
      }
      if (!isNode(el)) {
        throw new Error('svgsaver: Can\'t find an svg element');
      }
      return el;
    }
  }, {
    key: 'getFilename',
    value: function getFilename(el, filename, ext) {
      if (!filename || filename === '') {
        filename = (el.getAttribute('title') || 'untitled') + '.' + ext;
      }
      return encodeURI(filename);
    }

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
  }]);

  function SvgSaver() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var attrs = _ref.attrs;
    var styles = _ref.styles;

    _classCallCheck(this, SvgSaver);

    this.attrs = attrs === undefined ? svgAttrs : attrs;
    this.styles = styles === undefined ? svgStyles : styles;
  }

  /**
  * Return the cloned SVG after cleaning
  *
  * @param {SVGElement} el The element to copy.
  * @returns {SVGElement} SVG text after cleaning
  * @api public
  */

  _createClass(SvgSaver, [{
    key: 'cloneSVG',
    value: function cloneSVG(el) {
      el = SvgSaver.getSvg(el);
      var svg = cloneSvg(el, this.attrs, this.styles);

      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      svg.setAttribute('version', 1.1);

      // height and width needed to download in FireFox
      svg.setAttribute('width', svg.getAttribute('width') || '500');
      svg.setAttribute('height', svg.getAttribute('height') || '900');

      return svg;
    }

    /**
    * Return the SVG HTML text after cleaning
    *
    * @param {SVGElement} el The element to copy.
    * @returns {String} SVG text after cleaning
    * @api public
    */
  }, {
    key: 'getHTML',
    value: function getHTML(el) {
      var svg = this.cloneSVG(el);

      var html = svg.outerHTML;
      if (html) {
        return html;
      }

      // see http://stackoverflow.com/questions/19610089/unwanted-namespaces-on-svg-markup-when-using-xmlserializer-in-javascript-with-ie
      svg.removeAttribute('xmlns');
      svg.removeAttribute('xmlns:xlink');

      svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

      return new window.XMLSerializer().serializeToString(svg);
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
      var html = encodeURIComponent(this.getHTML(el));
      if (isDefined(window.btoa)) {
        // see http://stackoverflow.com/questions/23223718/failed-to-execute-btoa-on-window-the-string-to-be-encoded-contains-characte
        return 'data:image/svg+xml;base64,' + window.btoa(unescape(html));
      }
      return 'data:image/svg+xml,' + html;
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
      el = SvgSaver.getSvg(el);
      filename = SvgSaver.getFilename(el, filename, 'svg');
      if (isFunction(Blob)) {
        return _fileSaver2['default'].saveAs(this.getBlob(el), filename);
      }
      return saveUri(this.getUri(el), filename);
    }

    /**
    * Gets the SVG as a PNG data URI.
    *
    * @param {SVGElement} el The element to copy.
    * @param {Function} cb Call back called with the PNG data uri.
    * @api public
    */
  }, {
    key: 'getPngUri',
    value: function getPngUri(el, cb) {
      if (isIE11) {
        console.error('svgsaver: getPngUri not supported on IE11');
      }
      el = SvgSaver.getSvg(el);
      var filename = SvgSaver.getFilename(el, null, 'png');
      return createCanvas(this.getUri(el), filename, function (canvas) {
        cb(canvas.toDataURL('image/png'));
      });
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
      if (isIE11) {
        console.error('svgsaver: asPng not supported on IE11');
      }
      el = SvgSaver.getSvg(el);
      filename = SvgSaver.getFilename(el, filename, 'png');
      return savePng(this.getUri(el), filename);
    }
  }]);

  return SvgSaver;
})();

exports['default'] = SvgSaver;
module.exports = exports['default'];
