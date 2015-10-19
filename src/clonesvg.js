/* Some utilities for cloning SVGs with inline styles */
import copyStyles from 'copy-styles';

import {isUndefined} from './utils';

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
