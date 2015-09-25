import {svgAttrs, svgStyles} from './collection';

function isUndefined(value) {return typeof value === 'undefined';}
function isDefined(value) {return typeof value !== 'undefined';}
var forEach = Array.prototype.forEach;

//detection
var DownloadAttributeSupport = 'download' in document.createElement('a');
//navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob;

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

//var getURL = window.URL || window.webkitURL || window;

function saveUri(url, name){
  if (DownloadAttributeSupport) {
    var dl = document.createElement('a');
    dl.setAttribute('href', url);
    dl.setAttribute('download', name);
    dl.click();
  } else {
    //console.log(url);
    window.open(url, '_blank', '');
  }
}

export default class SvgSaver {
  constructor(opts) {
    // todo: options
  }

  getHTML(el) {
    var svg = cloneSvg(el);

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('version', 1.1);
    svg.setAttribute('width', svg.getAttribute('width') || '500');
    svg.setAttribute('height', svg.getAttribute('height') || '900');

    return svg.outerHTML || (new window.XMLSerializer()).serializeToString(svg);
  }

  getBlob(el) {
    var html = this.getHTML(el);
    return new Blob([html], { type: 'text/xml' });
  }

  getUri(el) {
    var html = this.getHTML(el);
    return 'data:image/svg+xml;base64,' + window.btoa(html);
    //return "data:image/svg+xml," + encodeURIComponent(html);
  }

  asSvg(el, filename) {
    if (!filename || filename === '') {
      filename = el.getAttribute('title');
      filename = (filename || 'untitled')+'.svg';
    }

    if (isDefined(window.saveAs)) {
      return saveAs(this.getBlob(el), filename);
    } else {
      return saveUri(this.getUri(el), filename);
    }

  }

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



      //if (isDefined(navigator.saveBlob)) {
      //  canvas.toBlob(function(blob) {
      //    console.log('saveBlob', blob);
      //    navigator.saveBlob(blob, filename);
      //  });
      //} else
      if (isDefined(window.saveAs)) {
        canvas.toBlob(function(blob) {
          //console.log('saveAs', blob);
          saveAs(blob, filename);
        });
      } else {
        var uri = canvas.toDataURL('image/png');
        //console.log('uri', uri);
        saveUri(uri, filename);
      }

    }
    image.src = this.getUri(el);
    //console.log('src', image.src);
  }

}

// allows require('svgsaver') in JSPM for common interface
export var __useDefault = true;
