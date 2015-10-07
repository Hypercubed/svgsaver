'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isDefined = isDefined;
exports.isFunction = isFunction;
exports.isUndefined = isUndefined;

function isDefined(value) {
  return typeof value !== 'undefined';
}

function isFunction(value) {
  return typeof value === 'function';
}

function isUndefined(value) {
  return typeof value === 'undefined';
}
//# sourceMappingURL=utils.js.map