/* global Image, MouseEvent */

/* Some simple utilities for saving SVGs, including an alternative to saveAs */

import {isDefined} from './utils';
import FileSaver from 'file-saver';

// detection
const DownloadAttributeSupport = (typeof document !== 'undefined') &&
  ('download' in document.createElement('a')) &&
  (typeof MouseEvent === 'function');

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

export function createCanvas (uri, name, cb) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const image = new Image();
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    cb(canvas);
  };
  image.src = uri;
  return true;
}

export function savePng (uri, name) {
  return createCanvas(uri, name, function (canvas) {
    if (isDefined(canvas.toBlob)) {
      canvas.toBlob(function (blob) {
        FileSaver.saveAs(blob, name);
      });
    } else {
      saveUri(canvas.toDataURL('image/png'), name);
    }
  });
}
