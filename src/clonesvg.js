/* Some utilities for cloning SVGs with inline styles */


import {isUndefined, isDefined} from './utils';

// Gets computed styles for an SVG element
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

// Vonvert computed styles to something we can iterate over
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

// Copies computed styles from source to target
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

// Removes attributes that are not valid for SVGs
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

// Clones an SVGElement, copyies approprate atttributes and styles.
export function cloneSvg(src, attrs, styles) {
  var clonedSvg = src.cloneNode(true);
  var srcChildren = src.querySelectorAll('*');

  Array.prototype.slice.call(clonedSvg.querySelectorAll('*'))
    .forEach(function( target, index ) {
      copyStyles(srcChildren[index], target, styles);
      cleanAttrs(target, attrs, styles);
    });

  return clonedSvg;
}
