import {svgAttrs, svgStyles} from './collection';

function isUndefined(value) {return typeof value === 'undefined';}
function isDefined(value) {return typeof value !== 'undefined';}
function isFunction(value) {return typeof value === 'function';}

// adapted from https://github.com/angular/angular.js/issues/2866#issuecomment-31012434
function getComputedStyles(node) {
  if (isDefined(node.currentStyle)) {  //for old IE
    return node.currentStyle;
  } else if (isDefined(window.getComputedStyle)){  //for modern browsers
    return node.ownerDocument.defaultView.getComputedStyle(node,null);
  } else {
    return node.style;
  }
}

// convert computed styles to something we can iterate over
// adapted from http://stackoverflow.com/questions/754607/can-jquery-get-all-css-styles-associated-with-an-element/6416527#6416527
function convertComputedStyle(computed) {
  if(isDefined(window.getComputedStyle)){
    var styles = {};
    for(var i = 0, l = computed.length; i < l; i++){
      var prop = computed[i];
      var val = computed.getPropertyValue(prop);
      styles[prop] = val;
    }
    return styles;
  }
  return computed;
}

function copyStyles(source, target, defaultStyles) {  // styles === false - copy none, true - copy all
  if (defaultStyles === false) { return; }

  var srcStyles = getComputedStyles(source);

  if (defaultStyles === true) {    // copy all styles
    for (let key in convertComputedStyle(srcStyles)) {
      target.style[key] = srcStyles[key];
    }
    return;
  }

  var parStyles = getComputedStyles(target.parentNode);

  for (let key in defaultStyles) {
    var src = srcStyles[key];
    if (src && src !== defaultStyles[key] && src !== parStyles[key] ) {
      target.style[key] = src;
    }
  }
}

function cleanAttrs(el, attrs, styles) {  // attrs === false - remove all, attrs === true - allow all
  if (attrs === true) { return; }

  Array.prototype.slice.call(el.attributes)
    .forEach(function(attr) {
      // remove if it is not style nor on attrs  whitelist
      // keeping attributes that are also styles because attributes override
      if (attr.specified) {
        if(attrs === false || (isUndefined(styles[attr.name]) && attrs.indexOf(attr.name) < 0)) {
          el.removeAttribute(attr.name);
        }
      }
    });
}

function cloneSvg(src, attrs, styles) {
  var clonedSvg = src.cloneNode(true);
  var srcChildren = src.querySelectorAll('*');

  Array.prototype.slice.call(clonedSvg.querySelectorAll('*'))
    .forEach(function( target, index ) {
      copyStyles(srcChildren[index], target, styles);
      cleanAttrs(target, attrs, styles);
    });

  return clonedSvg;
}

//detection
var DownloadAttributeSupport = 'download' in document.createElement('a');

function saveUri(url, name){
  if (DownloadAttributeSupport) {
    var dl = document.createElement('a');
    dl.setAttribute('href', url);
    dl.setAttribute('download', name);
    dl.click();
  } else {
    window.open(url, '_blank', '');
  }
  return true;
}

export class SvgSaver {

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
  constructor(opts = {}) {
    // todo: options
    this.attrs = (opts.attrs === undefined) ? svgAttrs : opts.attrs;
    this.styles = (opts.styles === undefined) ? svgStyles : opts.styles;
  }

  /**
  * Return the SVG HTML text after cleaning
  *
  * @param {SVGElement} el The element to copy.
  * @returns {String} SVG text after cleaning
  * @api public
  */
  getHTML(el) {
    var svg = cloneSvg(el, this.attrs, this.styles);

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('version', 1.1);

    // height and width needed to download in FireFox
    svg.setAttribute('width', svg.getAttribute('width') || '500');
    svg.setAttribute('height', svg.getAttribute('height') || '900');

    return svg.outerHTML || (new window.XMLSerializer()).serializeToString(svg);
  }

  /**
  * Return the SVG, after cleaning, as a text/xml Blob
  *
  * @param {SVGElement} el The element to copy.
  * @returns {Blog} SVG as a text/xml Blob
  * @api public
  */
  getBlob(el) {
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
  getUri(el) {
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
  asSvg(el, filename) {
    if (!filename || filename === '') {
      filename = el.getAttribute('title');
      filename = (filename || 'untitled')+'.svg';
    }

    if (isDefined(window.saveAs) && isFunction(Blob)) {
      saveAs(this.getBlob(el), filename);
    } else {
      saveUri(this.getUri(el), filename);
    }
    return this;

  }

  /**
  * Saves the SVG as a PNG file using method compatible with the browser
  *
  * @param {SVGElement} el The element to copy.
  * @param {string} [filename] The filename to save, defaults to the SVG title or 'untitled.png'
  * @returns {SvgSaver} The SvgSaver instance
  * @api public
  */
  asPng(el, filename) {
    if (!filename || filename === '') {
      filename = el.getAttribute('title');
      filename = (filename || 'untitled')+'.png';
    }

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var image = new Image();
    image.onload = function() {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      if (isDefined(window.saveAs) && isDefined(canvas.toBlob)) {
        canvas.toBlob(function(blob) {
          saveAs(blob, filename);
        });
      } else {
        var uri = canvas.toDataURL('image/png');
        saveUri(uri, filename);
      }

    };
    image.src = this.getUri(el);
    return true;
  }

}

export default SvgSaver;
