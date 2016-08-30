/* global Blob */

import test from 'tape';
import SvgSaver from '../src/';

const html = `
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

let originalSvg;
let svgHtml;
let newSvgDom;

function beforeEach (svgSaver) {
  svgSaver = svgSaver || new SvgSaver();
  originalSvg = toDom(html);
  svgHtml = svgSaver.getHTML(originalSvg);
  newSvgDom = toDom(svgHtml);
}

test('should convert SVG element', t => {
  t.plan(1);

  beforeEach();
  t.equal(svgHtml.slice(0, 4), '<svg');
});

test('should find first svg in element', t => {
  t.plan(1);

  beforeEach();

  svgHtml = new SvgSaver().getHTML(pg);
  t.equal(svgHtml.slice(0, 4), '<svg');
});

test('should find first svg in body', t => {
  t.plan(1);

  beforeEach();

  svgHtml = new SvgSaver().getHTML();
  t.equal(svgHtml.slice(0, 4), '<svg');
});

test('should find svg by querySelector', t => {
  t.plan(1);

  beforeEach();

  svgHtml = new SvgSaver().getHTML('#svg-0');
  t.equal(svgHtml.slice(0, 4), '<svg');
});

test('should throw if no svg found', t => {
  t.plan(1);

  beforeEach();

  t.throws(() => {
    new SvgSaver().getHTML('#svg-1');
  });
});

test('should convert SVG element with children', t => {
  t.plan(1);

  beforeEach();
  t.notEqual(svgHtml.indexOf('<rect'), -1);
});

test('should convert SVG element with styles', t => {
  t.plan(1);

  beforeEach();
  const rect = newSvgDom.querySelector('#rect-0');
  t.equal(rect.style.opacity, '0.5');
});

test('should convert SVG element with CSS defined styles', t => {
  t.plan(1);

  beforeEach();
  const rect = newSvgDom.querySelector('#rect-0');
  t.equal(rect.style['stroke-opacity'], '0.75');
});

test('should convert SVG element removing unneeded attrs', t => {
  t.plan(1);

  beforeEach();
  const rect = newSvgDom.querySelector('#rect-0');
  t.equal(rect.attributes['ng-scope'], undefined);
});

test('should copy inheritable styles even if default', t => {
  t.plan(1);

  beforeEach();
  const rect = newSvgDom.querySelector('#rect-0');
  t.equal(rect.style['fill-opacity'], '1');
});

test('should copy inheritable styles even if default, unless same as parent', t => {
  t.plan(1);

  beforeEach();
  const rect = newSvgDom.querySelector('#rect-0');
  console.log(rect.style['stroke-width'], rect.parentNode.style['stroke-width']);
  t.equal(rect.style['stroke-width'], '');
});

test('should remove all attributes and styles when false', t => {
  t.plan(5);

  const svgSaver = new SvgSaver({
    styles: false,
    attrs: false
  });

  beforeEach(svgSaver);
  const rect = newSvgDom.querySelector('rect');

  t.equal(rect.style.opacity, '');
  t.equal(rect.style['stroke-opacity'], '');
  t.equal(rect.hasAttribute('ng-scope'), false);
  t.equal(rect.hasAttribute('x'), false);
  t.equal(rect.hasAttribute('y'), false);
});

test('should remove all attributes and styles when empty', t => {
  t.plan(5);

  const svgSaver = new SvgSaver({
    styles: {},
    attrs: []
  });

  beforeEach(svgSaver);
  const rect = newSvgDom.querySelector('rect');

  t.equal(rect.style.opacity, '');
  t.equal(rect.style['stroke-opacity'], '');
  t.equal(rect.hasAttribute('ng-scope'), false);
  t.equal(rect.hasAttribute('x'), false);
  t.equal(rect.hasAttribute('y'), false);
});

test('should retain inline styles and CSS styles in whitelist', t => {
  t.plan(5);

  const svgSaver = new SvgSaver({
    styles: {
      'stroke-opacity': '1'
    },
    attrs: ['id', 'style']
  });

  beforeEach(svgSaver);
  const rect = newSvgDom.querySelector('rect');

  t.equal(rect.style.opacity, '0.5');
  t.equal(rect.style['stroke-opacity'], '0.75');
  t.equal(rect.hasAttribute('ng-scope'), false);
  t.equal(rect.hasAttribute('x'), false);
  t.equal(rect.hasAttribute('y'), false);
});

test('should retain inline styles and attributes in whitelist', t => {
  t.plan(5);

  const svgSaver = new SvgSaver({
    styles: {
      'stroke-opacity': '1'
    },
    attrs: ['id', 'style', 'ng-scope', 'x']
  });

  beforeEach(svgSaver);
  const rect = newSvgDom.querySelector('rect');

  t.equal(rect.style.opacity, '0.5');
  t.equal(rect.style['stroke-opacity'], '0.75');
  t.ok(rect.hasAttribute('ng-scope'));
  t.equal(rect.getAttribute('x'), '10');
  t.equal(rect.hasAttribute('y'), false);
});

test('should copy all attributes and styles when true', t => {
  t.plan(5);

  const svgSaver = new SvgSaver({
    attrs: true,  // copy all attributes
    styles: true  // copy all styles
  });

  beforeEach(svgSaver);
  const rect = newSvgDom.querySelector('rect');

  t.equal(rect.style.opacity, '0.5');
  t.equal(rect.style['stroke-opacity'], '0.75');
  t.ok(rect.hasAttribute('ng-scope'));
  t.equal(rect.getAttribute('x'), '10');
  t.equal(rect.getAttribute('y'), '10');
});

test('should convert SVG element to Blob', t => {
  t.plan(1);

  const svgSaver = new SvgSaver();
  toDom(html);

  if (typeof window.Blob !== 'function') {
    window.Blob = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  }

  const e = document.querySelector('#svg-0');
  const blob = svgSaver.getBlob(e);
  t.ok(blob instanceof Blob);
});

test('should convert SVG element to URI', t => {
  t.plan(1);

  const svgSaver = new SvgSaver();
  toDom(html);

  const e = document.querySelector('#svg-0');
  const uri = svgSaver.getUri(e);
  t.notEqual(uri.indexOf('data:image/svg+xml;base64'), -1);
});

test('should save SVG', t => {
  t.plan(1);

  const svgSaver = new SvgSaver();
  toDom(html);

  const e = document.querySelector('#svg-0');
  t.doesNotThrow(() => {
    svgSaver.asSvg(e);
  });
});

test('should save PNG', t => {
  t.plan(1);

  const svgSaver = new SvgSaver();
  toDom(html);

  const e = document.querySelector('#svg-0');
  t.doesNotThrow(() => {
    svgSaver.asPng(e);
  });
});

test('should convert fast mode', t => {
  t.plan(6);

  const svgSaver = new SvgSaver({fast: true});

  beforeEach(svgSaver);
  const rect = newSvgDom.querySelector('rect');

  t.equal(rect.style.opacity, '0.5');
  t.equal(rect.style['stroke-opacity'], '');
  t.equal(rect.style['fill-opacity'], '');
  t.notEqual(rect.style.stroke, 'none');
  t.equal(rect.getAttribute('x'), '10');
  t.equal(rect.getAttribute('y'), '10');
});
