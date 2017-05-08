/* global Blob */

import {svgAttrs, svgStyles, inheritableAttrs} from './collection';
import {cloneSvg} from './clonesvg';
import {saveUri, savePng, createCanvas} from './saveuri';
import {isDefined, isFunction, isUndefined, isNode} from './utils';
import FileSaver from 'file-saver';

const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

// inheritable styles may be overridden by parent, always copy for now
inheritableAttrs.forEach(function (k) {
  if (k in svgStyles) {
    svgStyles[k] = true;
  }
});

export class SvgSaver {

  static getSvg (el) {
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

  static getFilename (el, filename, ext) {
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
  constructor ({ attrs, styles } = {}) {
    this.attrs = (attrs === undefined) ? svgAttrs : attrs;
    this.styles = (styles === undefined) ? svgStyles : styles;
  }

  /**
  * Return the cloned SVG after cleaning
  *
  * @param {SVGElement} el The element to copy.
  * @returns {SVGElement} SVG text after cleaning
  * @api public
  */
  cloneSVG (el) {
    el = SvgSaver.getSvg(el);
    const svg = cloneSvg(el, this.attrs, this.styles);

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
  getHTML (el) {
    const svg = this.cloneSVG(el);

    var html = svg.outerHTML;
    if (html) {
      return html;
    }

    // see http://stackoverflow.com/questions/19610089/unwanted-namespaces-on-svg-markup-when-using-xmlserializer-in-javascript-with-ie
    svg.removeAttribute('xmlns');
    svg.removeAttribute('xmlns:xlink');

    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');

    return (new window.XMLSerializer()).serializeToString(svg);
  }

  /**
  * Return the SVG, after cleaning, as a text/xml Blob
  *
  * @param {SVGElement} el The element to copy.
  * @returns {Blog} SVG as a text/xml Blob
  * @api public
  */
  getBlob (el) {
    const html = this.getHTML(el);
    return new Blob([html], { type: 'text/xml' });
  }

  /**
  * Return the SVG, after cleaning, as a image/svg+xml;base64 URI encoded string
  *
  * @param {SVGElement} el The element to copy.
  * @returns {String} SVG as image/svg+xml;base64 URI encoded string
  * @api public
  */
  getUri (el) {
    const html = encodeURIComponent(this.getHTML(el));
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
  asSvg (el, filename) {
    el = SvgSaver.getSvg(el);
    filename = SvgSaver.getFilename(el, filename, 'svg');
    if (isFunction(Blob)) {
      return FileSaver.saveAs(this.getBlob(el), filename);
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
  getPngUri (el, cb) {
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
  asPng (el, filename) {
    if (isIE11) {
      console.error('svgsaver: asPng not supported on IE11');
    }
    el = SvgSaver.getSvg(el);
    filename = SvgSaver.getFilename(el, filename, 'png');
    return savePng(this.getUri(el), filename);
  }

}

export default SvgSaver;
