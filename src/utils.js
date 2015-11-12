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
