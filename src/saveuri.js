/* global saveAs, Image, MouseEvent */

/* Some simple utilities for saving SVGs, including an alternative to saveAs */

import {isDefined} from './utils';

// detection
const DownloadAttributeSupport = (typeof document !== 'undefined') && ('download' in document.createElement('a'));

export function saveUri (uri, name) {
  if (DownloadAttributeSupport) {
    const dl = document.createElement('a');
    dl.setAttribute('href', uri);
    dl.setAttribute('download', name);
    // firefox doesn't support `.click()`...
    // from https://github.com/sindresorhus/multi-download/blob/gh-pages/index.js
    dl.dispatchEvent(new MouseEvent('click'));
    return true;
  } else if (typeof window !== 'undefined') {
    window.open(uri, '_blank', '');
    return true;
  }

  return false;
}

export function savePng (uri, name) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const image = new Image();
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    if (isDefined(window.saveAs) && isDefined(canvas.toBlob)) {
      canvas.toBlob(function (blob) {
        saveAs(blob, name);
      });
    } else {
      saveUri(canvas.toDataURL('image/png'), name);
    }
  };
  image.src = uri;
  return true;
}
