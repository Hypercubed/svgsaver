'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.saveUri = saveUri;
exports.savePng = savePng;

var _utils = require('./utils');

var DownloadAttributeSupport = typeof document !== 'undefined' && 'download' in document.createElement('a');

function saveUri(uri, name) {

  if ((0, _utils.isDefined)(window.saveAs) && (0, _utils.isFunction)(Blob)) {
    return saveAs(this.getBlob(el), name);
  } else {
    if (DownloadAttributeSupport) {
      var dl = document.createElement('a');
      dl.setAttribute('href', uri);
      dl.setAttribute('download', name);
      dl.click();
      return true;
    } else if (typeof window !== 'undefined') {
      window.open(uri, '_blank', '');
      return true;
    }
  }

  return false;
}

function savePng(uri, name) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  var image = new Image();
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    if ((0, _utils.isDefined)(window.saveAs) && (0, _utils.isDefined)(canvas.toBlob)) {
      canvas.toBlob(function (blob) {
        saveAs(blob, name);
      });
    } else {
      var uri = canvas.toDataURL('image/png');
      saveUri(uri, name);
    }
  };
  image.src = uri;
  return true;
}
//# sourceMappingURL=saveuri.js.map