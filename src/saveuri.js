/* Some simple utilities for saving SVGs, including an alternative to saveAs */

import {isDefined, isFunction} from './utils';

//detection
var DownloadAttributeSupport = (typeof document !== 'undefined') && ('download' in document.createElement('a'));

export function saveUri(uri, name){

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

  return false;
}

export function savePng(uri, name){
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  var image = new Image();
  image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    if (isDefined(window.saveAs) && isDefined(canvas.toBlob)) {
      canvas.toBlob(function(blob) {
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
