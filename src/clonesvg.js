/* Some utilities for cloning SVGs with inline styles */
import computedStyles from 'computed-styles';
import {isUndefined} from './utils';
import {inheritableAttrs} from './collection';

// Removes attributes that are not valid for SVGs
function cleanAttrs (el, attrs, styles) {  // attrs === false - remove all, attrs === true - allow all
  if (attrs === true) { return; }

  Array.prototype.slice.call(el.attributes)
    .forEach(function (attr) {
      // remove if it is not style nor on attrs  whitelist
      // keeping attributes that are also styles because attributes override
      if (attr.specified) {
        if (attrs === '' || attrs === false || (isUndefined(styles[attr.name]) && attrs.indexOf(attr.name) < 0)) {
          el.removeAttribute(attr.name);
        }
      }
    });
}

function cleanStyle (tgt, parentStyles) {
  parentStyles = parentStyles || tgt.parentNode.style;
  inheritableAttrs.forEach(function (key) {
    if (tgt.style[key] === parentStyles[key]) {
      tgt.style.removeProperty(key);
    }
  });
}

function domWalk (src, tgt, down, up) {
  down(src, tgt);
  const children = src.childNodes;
  for (var i = 0; i < children.length; i++) {
    domWalk(children[i], tgt.childNodes[i], down, up);
  }
  up(src, tgt);
}

// Clones an SVGElement, copies approprate atttributes and styles.
export function cloneSvg (src, attrs, styles) {
  const clonedSvg = src.cloneNode(true);

  domWalk(src, clonedSvg, (src, tgt) => {
    if (tgt.style) { computedStyles(src, tgt.style, styles); }
  }, (src, tgt) => {
    if (tgt.style && tgt.parentNode) { cleanStyle(tgt); }
    if (tgt.attributes) { cleanAttrs(tgt, attrs, styles); }
  });

  return clonedSvg;
}
