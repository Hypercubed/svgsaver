'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = cloneSvg;

var _utils = require('./utils');

function getComputedStyles(node) {
  if ((0, _utils.isDefined)(node.currentStyle)) {
    return node.currentStyle;
  } else if ((0, _utils.isDefined)(window.getComputedStyle)) {
    return node.ownerDocument.defaultView.getComputedStyle(node, null);
  } else {
    return node.style;
  }
}

function convertComputedStyle(computed) {
  if ((0, _utils.isDefined)(window.getComputedStyle)) {
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

function copyStyles(source, target, defaultStyles) {
  if (defaultStyles === false) {
    return;
  }

  var srcStyles = getComputedStyles(source);

  if (defaultStyles === true) {
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

function cleanAttrs(el, attrs, styles) {
  if (attrs === true) {
    return;
  }

  Array.prototype.slice.call(el.attributes).forEach(function (attr) {
    if (attr.specified) {
      if (attrs === false || (0, _utils.isUndefined)(styles[attr.name]) && attrs.indexOf(attr.name) < 0) {
        el.removeAttribute(attr.name);
      }
    }
  });
}

function cloneSvg(src, attrs, styles) {
  var clonedSvg = src.cloneNode(true);
  var srcChildren = src.querySelectorAll('*');

  Array.prototype.slice.call(clonedSvg.querySelectorAll('*')).forEach(function (target, index) {
    copyStyles(srcChildren[index], target, styles);
    cleanAttrs(target, attrs, styles);
  });

  return clonedSvg;
}

module.exports = exports['default'];
//# sourceMappingURL=clonesvg.js.map