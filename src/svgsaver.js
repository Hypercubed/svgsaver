import saveAs from 'FileSaver';

//function isString(value) {return typeof value === 'string';}
function isUndefined(value) {return typeof value === 'undefined';}
function isDefined(value) {return typeof value !== 'undefined';}

var forEach = Array.prototype.forEach;

var svgStyles = {   // Whitelist of CSS stylkes and default values
  'alignment-baseline':'auto',
  'baseline-shift':'baseline',
  'clip':'auto',
  'clip-path':'none',
  'clip-rule':'nonzero',
  'color':'rgb(51, 51, 51)',
  'color-interpolation':'srgb',
  'color-interpolation-filters':'linearrgb',
  'color-profile':'auto',
  'color-rendering':'auto',
  'cursor':'auto',
  'direction':'ltr',
  'display':'inline',
  'dominant-baseline':'auto',
  'enable-background':'',
  'fill':'rgb(0, 0, 0)',
  'fill-opacity':'1',
  'fill-rule':'nonzero',
  'filter':'none',
  'flood-color':'rgb(0, 0, 0)',
  'flood-opacity':'1',
  'font':'',
  'font-family':'normal',
  'font-size':'medium',
  'font-size-adjust':'auto',
  'font-stretch':'normal',
  'font-style':'normal',
  'font-variant':'normal',
  'font-weight':'400',
  'glyph-orientation-horizontal':'0deg',
  'glyph-orientation-vertical':'auto',
  'image-rendering':'auto',
  'kerning':'auto',
  'letter-spacing':'0',
  'lighting-color':'rgb(255, 255, 255)',
  'marker':'',
  'marker-end':'none',
  'marker-mid':'none',
  'marker-start':'none',
  'mask':'none',
  'opacity':'1',
  'overflow':'visible',
  'paint-order': 'normal',
  'pointer-events':'auto',
  'shape-rendering':'auto',
  'stop-color':'rgb(0, 0, 0)',
  'stop-opacity':'1',
  'stroke':'none',
  'stroke-dasharray':'none',
  'stroke-dashoffset':'0',
  'stroke-linecap':'butt',
  'stroke-linejoin':'miter',
  'stroke-miterlimit':'4',
  'stroke-opacity':'1',
  'stroke-width':'1',
  'text-anchor':'start',
  'text-decoration':'none',
  'text-rendering':'auto',
  'unicode-bidi':'normal',
  'visibility':'visible',
  'word-spacing':'0px',
  'writing-mode':'lr-tb'
};

var svgAttrs = [  // white list of attributes
  'id', 'xml:base', 'xml:lang', 'xml:space', // Core
  'height', 'result', 'width', 'x', 'y',     // Primitive
  'xlink:href',                              // Xlink attribute
  'style','class',
  'd','pathLength',                          // Path
  'x','y','dx','dy','glyphRef','format',
  'x1','y1','x2','y2',
  'rotate','textLength',
  'cx','cy','r',
  'rx','ry',
  'fx','fy',
  'width','height',
  'refX','refY','orient',
  'markerUnits','markerWidth','markerHeight',
  'maskUnits',
  'transform',
  'viewBox','version',                      // Container
  'preserveAspectRatio','xmlns',
  'points',                                 // Polygons
  'offset'
];

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

class SvgSaver {
  constructor(el) {
    // check for Blob and FileSaver

    this.el = el;
  }

  getHTML() {
    var svg = cloneSvg(this.el);

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('version', 1.1);

    return svg.outerHTML || (new window.XMLSerializer()).serializeToString(svg);
  }

  getBlob() {
    var html = this.getHTML();
    return new Blob([html], { type: 'text/xml' });
  }

  asSvg(filename) {
    if (!filename || filename === '') {
      filename = this.el.getAttribute('title');
      filename = (filename || 'untitled')+'.svg';
    }

    return saveAs(this.getBlob(), filename);
  }

}

export default SvgSaver;
