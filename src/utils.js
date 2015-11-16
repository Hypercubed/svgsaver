/* Some simple utilities */

export const isFunction = (a) => typeof a === 'function';
export const isDefined = (a) => typeof a !== 'undefined';
export const isUndefined = (a) => typeof a === 'undefined';
export const isObject = (a) => (a !== null && typeof a === 'object');

export function clone (obj) {
  if (obj == null || typeof obj !== 'object') { return obj; }
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) { copy[attr] = obj[attr]; }
  }
  return copy;
}

// from https://github.com/npm-dom/is-dom/blob/master/index.js
export function isNode (val) {
  if (!isObject(val)) { return false; }
  if (isDefined(window) && isObject(window.Node)) { return val instanceof window.Node; }
  return typeof val.nodeType === 'number' && typeof val.nodeName === 'string';
}
