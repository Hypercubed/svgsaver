/* global Blob */

import test from 'tape';
import SvgSaver from '../src/';

var html = `
  <style>
    rect { stroke-opacity: 0.75; fill-opacity: 1; stroke-width: 1; fill: #0000ff; stroke:none; }
    g { fill-opacity: 0.75; stroke-width: 1;  }'
  </style>
  <svg id="svg-0">
    <g>
      <rect id="rect-0" ng-scope x="10" y="10" height="100" width="100" style="opacity: 0.5; stroke:#ff0000;"/>
    </g>
  </svg>`;

const pg = document.createElement('div');
document.body.appendChild(pg);

function toDom (html) {
  pg.innerHTML = html;
  return pg.querySelector('svg');
}

var originalSvg, svgHtml, newSvgDom;

function beforeEach (svgSaver) {
  svgSaver = svgSaver || new SvgSaver();
  originalSvg = toDom(html);
  svgHtml = svgSaver.getHTML(originalSvg);
  newSvgDom = toDom(svgHtml);
}

test('should convert SVG element', (t) => {
  t.plan(1);

  beforeEach();
  t.equal(svgHtml.slice(0, 4), '<svg');
});

test('should find first svg in element', (t) => {
  t.plan(1);

  beforeEach();

  svgHtml = new SvgSaver().getHTML(pg);
  t.equal(svgHtml.slice(0, 4), '<svg');
});

test('should find first svg in body', (t) => {
  t.plan(1);

  beforeEach();

  svgHtml = new SvgSaver().getHTML();
  t.equal(svgHtml.slice(0, 4), '<svg');
});

test('should find svg by querySelector', (t) => {
  t.plan(1);

  beforeEach();

  svgHtml = new SvgSaver().getHTML('#svg-0');
  t.equal(svgHtml.slice(0, 4), '<svg');
});

test('should throw if no svg found', (t) => {
  t.plan(1);

  beforeEach();

  t.throws(function () {
    new SvgSaver().getHTML('#svg-1');
  });
});

test('should convert SVG element with children', function (t) {
  t.plan(1);

  beforeEach();
  t.notEqual(svgHtml.indexOf('<rect'), -1);
});

test('should convert SVG element with styles', function (t) {
  t.plan(1);

  beforeEach();
  var rect = newSvgDom.querySelector('#rect-0');
  t.equal(rect.style.opacity, '0.5');
});

test('should convert SVG element with CSS defined styles', function (t) {
  t.plan(1);

  beforeEach();
  var rect = newSvgDom.querySelector('#rect-0');
  t.equal(rect.style['stroke-opacity'], '0.75');
});

test('should convert SVG element removing unneeded attrs', function (t) {
  t.plan(1);

  beforeEach();
  var rect = newSvgDom.querySelector('#rect-0');
  t.equal(rect.attributes['ng-scope'], undefined);
});

test('should copy inheritable styles even if default', function (t) {
  t.plan(1);

  beforeEach();
  var rect = newSvgDom.querySelector('#rect-0');
  t.equal(rect.style['fill-opacity'], '1');
});

test('should copy inheritable styles even if default, unless same as parent', function (t) {
  t.plan(1);

  beforeEach();
  var rect = newSvgDom.querySelector('#rect-0');
  console.log(rect.style['stroke-width'], rect.parentNode.style['stroke-width']);
  t.equal(rect.style['stroke-width'], '');
});

test('should remove all attributes and styles when false', function (t) {
  t.plan(5);

  var svgSaver = new SvgSaver({
    styles: false,
    attrs: false
  });

  beforeEach(svgSaver);
  var rect = newSvgDom.querySelector('rect');

  t.equal(rect.style['opacity'], '');
  t.equal(rect.style['stroke-opacity'], '');
  t.equal(rect.hasAttribute('ng-scope'), false);
  t.equal(rect.hasAttribute('x'), false);
  t.equal(rect.hasAttribute('y'), false);
});

test('should remove all attributes and styles when empty', function (t) {
  t.plan(5);

  var svgSaver = new SvgSaver({
    styles: {},
    attrs: []
  });

  beforeEach(svgSaver);
  var rect = newSvgDom.querySelector('rect');

  t.equal(rect.style['opacity'], '');
  t.equal(rect.style['stroke-opacity'], '');
  t.equal(rect.hasAttribute('ng-scope'), false);
  t.equal(rect.hasAttribute('x'), false);
  t.equal(rect.hasAttribute('y'), false);
});

test('should retain inline styles and CSS styles in whitelist', function (t) {
  t.plan(5);

  var svgSaver = new SvgSaver({
    styles: {
      'stroke-opacity': '1'
    },
    attrs: ['id', 'style']
  });

  beforeEach(svgSaver);
  var rect = newSvgDom.querySelector('rect');

  t.equal(rect.style['opacity'], '0.5');
  t.equal(rect.style['stroke-opacity'], '0.75');
  t.equal(rect.hasAttribute('ng-scope'), false);
  t.equal(rect.hasAttribute('x'), false);
  t.equal(rect.hasAttribute('y'), false);
});

test('should retain inline styles and attributes in whitelist', function (t) {
  t.plan(5);

  var svgSaver = new SvgSaver({
    styles: {
      'stroke-opacity': '1'
    },
    attrs: ['id', 'style', 'ng-scope', 'x']
  });

  beforeEach(svgSaver);
  var rect = newSvgDom.querySelector('rect');

  t.equal(rect.style['opacity'], '0.5');
  t.equal(rect.style['stroke-opacity'], '0.75');
  t.ok(rect.hasAttribute('ng-scope'));
  t.equal(rect.getAttribute('x'), '10');
  t.equal(rect.hasAttribute('y'), false);
});

test('should copy all attributes and styles when true', function (t) {
  t.plan(5);

  var svgSaver = new SvgSaver({
    attrs: true,  // copy all attributes
    styles: true  // copy all styles
  });

  beforeEach(svgSaver);
  var rect = newSvgDom.querySelector('rect');

  t.equal(rect.style['opacity'], '0.5');
  t.equal(rect.style['stroke-opacity'], '0.75');
  t.ok(rect.hasAttribute('ng-scope'));
  t.equal(rect.getAttribute('x'), '10');
  t.equal(rect.getAttribute('y'), '10');
});

test('should convert SVG element to Blob', function (t) {
  t.plan(1);

  var svgSaver = new SvgSaver();
  toDom(html);

  if (typeof window.Blob !== 'function') {
    window.Blob = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  }

  var e = document.querySelector('#svg-0');
  var blob = svgSaver.getBlob(e);
  t.ok(blob instanceof Blob);
});

test('should convert SVG element to URI', function (t) {
  t.plan(1);

  var svgSaver = new SvgSaver();
  toDom(html);

  var e = document.querySelector('#svg-0');
  var uri = svgSaver.getUri(e);
  t.notEqual(uri.indexOf('data:image/svg+xml;base64'), -1);
});

test('should save SVG', function (t) {
  t.plan(1);

  var svgSaver = new SvgSaver();
  toDom(html);

  var e = document.querySelector('#svg-0');
  t.doesNotThrow(function () {
    svgSaver.asSvg(e);
  });
});

test('should save PNG', function (t) {
  t.plan(1);

  var svgSaver = new SvgSaver();
  toDom(html);

  var e = document.querySelector('#svg-0');
  t.doesNotThrow(function () {
    svgSaver.asPng(e);
  });
});
