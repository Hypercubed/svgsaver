import saveAs from 'html5-filesaver.js';
import {svgAttrs, svgStyles} from './collection';

function isUndefined(value) {return typeof value === 'undefined';}
function isDefined(value) {return typeof value !== 'undefined';}
function isFunction(value) {return typeof value === 'function';}
var forEach = Array.prototype.forEach;

// adapted from https://github.com/angular/angular.js/issues/2866#issuecomment-31012434
function getStyles(node, name) {
  var val;

  if (isDefined(node.currentStyle)) {  //for old IE
    val = node.currentStyle[name];
  } else if (isDefined(window.getComputedStyle)){  //for modern browsers
    val = node.ownerDocument.defaultView.getComputedStyle(node,null)[name];
  } else {
    val = node.style[name];
  }
  return  (val === '') ? undefined : val;
}

function copyStyles(source, target) {
  for (var key in svgStyles) {
    var _default = svgStyles[key];
    var src = getStyles(source,key);
    //var tgt = getStyles(target,key);
    var par = getStyles(target.parentNode,key);
    if (src && src !== _default /* &&  src !== tgt */ && src !== par  ) {
      target.style[key] = src;
    }
  }
}

function cleanAttrs(el) {
  forEach.call(el.attributes, function(attr) {
    // remove if it is not style nor on whitelist
    // keeping attributes that are also styles because some styles are not copied
    if(attr.specified && isUndefined(svgStyles[attr.name]) && svgAttrs.indexOf(attr.name) < 0) {
      el.removeAttribute(attr.name);
    }
  });
}

function cloneSvg(src) {
  var clonedSvg = src.cloneNode(true);
  var srcChildren = src.querySelectorAll('*');

  forEach.call(clonedSvg.querySelectorAll('*'), function( target, index ){
    copyStyles(srcChildren[index], target);
    cleanAttrs(target);
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
  constructor(opts) {
    // todo: options
  }

  /**
  * Return the SVG HTML text after cleaning
  *
  * @param {SVGElement} el The element to copy.
  * @returns {String} SVG text after cleaning
  * @api public
  */
  getHTML(el) {
    var svg = cloneSvg(el);

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
    return "data:image/svg+xml," + encodeURIComponent(html);
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
