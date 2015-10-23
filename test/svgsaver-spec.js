
var html = '<style>';
html += 'rect { stroke-opacity: 0.75; fill-opacity: 1; fill: #0000ff; stroke:none; }';
html += 'g { fill-opacity: 0.75 }';
html += '</style>';
html += '<svg id="svg-0">';
html += '<g>';
html += '<rect id="rect-0" ng-scope x="10" y="10" height="100" width="100" style="opacity: 0.5; stroke:#ff0000;"/>';
html += '</g>';
html += '</svg>';

function resetOriginal(html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  document.body.appendChild(div);
  return div.querySelector('svg');
}

function toDom(html) {
  var div = document.createElement('div');
  div.innerHTML = html;
  return div.querySelector('svg');
}

describe('svgsaver#getHTML', function() {

  var svgSaver = new SvgSaver();
  var originalSvg, newSvg, svgHtml;

  beforeEach(function() {
    originalSvg = resetOriginal(html);
    svgHtml = svgSaver.getHTML(originalSvg);
    newSvgDom = toDom(svgHtml);
  });

  it('should convert SVG element', function() {
    expect(svgHtml.slice(0, 4)).toEqual('<svg');
  });

	it('should convert SVG element with children', function() {
    expect(svgHtml).toContain('<rect');
	});

  it('should convert SVG element with styles', function() {
    var rect = newSvgDom.querySelector('#rect-0');
    expect(rect.style.opacity).toEqual('0.5');
  });

  it('should convert SVG element with CSS defined styles', function() {
    var rect = newSvgDom.querySelector('#rect-0');
    expect(rect.style['stroke-opacity']).toContain('0.75');
  });

  it('should convert SVG element removing unneeded attrs', function() {
    var rect = newSvgDom.querySelector('#rect-0');
    expect(rect.attributes).not.toContain('ng-scope');
  });

  it('should copy inheritable styles even if default', function() {
    var rect = newSvgDom.querySelector('#rect-0');
    expect(rect.style['fill-opacity']).toEqual('1');
  });

});

describe('svgsaver options', function() {

  var originalSvg;

  beforeEach(function() {
    originalSvg = resetOriginal(html);
  });

  it('should remove all attributes and styles when false', function() {

    svgSaver = new SvgSaver({
      styles: false,
      attrs: false
    });

    var svgHtml = svgSaver.getHTML(originalSvg);
    var newSvgDom = toDom(svgHtml);
    var rect = newSvgDom.querySelector('rect');
    var g = newSvgDom.querySelector('g');

    expect(rect.style['opacity']).toEqual('');
    expect(rect.style['stroke-opacity']).toEqual('');
    expect(rect.hasAttribute('ng-scope')).toEqual(false);
    expect(rect.hasAttribute('x')).toEqual(false);
    expect(rect.hasAttribute('y')).toEqual(false);
  });

  it('should remove all attributes and styles when empty', function() {

    var svgSaver = new SvgSaver({
      styles: {},
      attrs: []
    });

    var svgHtml = svgSaver.getHTML(originalSvg);
    var newSvgDom = toDom(svgHtml);
    var rect = newSvgDom.querySelector('rect');

    expect(rect.style['opacity']).toEqual('');
    expect(rect.style['stroke-opacity']).toEqual('');
    expect(rect.hasAttribute('ng-scope')).toEqual(false);
    expect(rect.hasAttribute('x')).toEqual(false);
    expect(rect.hasAttribute('y')).toEqual(false);
  });

  it('should retain inline styles and CSS styles in whitelist', function() {

    var svgSaver = new SvgSaver({
      styles: {
        'stroke-opacity':'1'
      },
      attrs: ['id','style']
    });

    var svgHtml = svgSaver.getHTML(originalSvg);
    var newSvgDom = toDom(svgHtml);
    var rect = newSvgDom.querySelector('#rect-0');

    expect(rect.style['opacity']).toEqual('0.5');
    expect(rect.style['stroke-opacity']).toEqual('0.75');
    expect(rect.hasAttribute('ng-scope')).toEqual(false);
    expect(rect.hasAttribute('x')).toEqual(false);
    expect(rect.hasAttribute('y')).toEqual(false);
  });

  it('should retain inline styles and attributes in whitelist', function() {

    var svgSaver = new SvgSaver({
      styles: {
        'stroke-opacity':'1'
      },
      attrs: ['id', 'style', 'ng-scope','x']
    });

    var svgHtml = svgSaver.getHTML(originalSvg);
    var newSvgDom = toDom(svgHtml);
    var rect = newSvgDom.querySelector('#rect-0');

    expect(rect.style['opacity']).toEqual('0.5');
    expect(rect.style['stroke-opacity']).toEqual('0.75');
    expect(rect.hasAttribute('ng-scope'));
    expect(rect.getAttribute('x')).toEqual('10');
    expect(rect.hasAttribute('y')).toEqual(false);
  });

  it('should copy all attributes and styles when true', function() {

    var svgSaver = new SvgSaver({
      attrs: true,  // copy all attributes
      styles: true  // copy all styles
    });

    var svgHtml = svgSaver.getHTML(originalSvg);
    var newSvgDom = toDom(svgHtml);
    var rect = newSvgDom.querySelector('#rect-0');

    expect(rect.style['opacity']).toEqual('0.5');
    expect(rect.style['stroke-opacity']).toEqual('0.75');
    expect(rect.hasAttribute('ng-scope'));
    expect(rect.getAttribute('x')).toEqual('10');
    expect(rect.getAttribute('y')).toEqual('10');
  });

});

describe('svgsaver#getBlob', function() {

  var svgSaver = new SvgSaver();

  if (typeof window.Blob !== 'function') {
    window.Blob = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  }

  it('should convert SVG element', function() {
    var e = document.querySelector('#svg-0');
    var blob = svgSaver.getBlob(e);
    expect(blob instanceof Blob);
  });

});

xdescribe('svgsaver#getUri', function() {

  var svgSaver = new SvgSaver();

  if (typeof window.Blob !== 'function') {
    window.Blob = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  }

  it('should convert SVG element', function() {
    var e = document.querySelector('#svg-0');
    var uri = svgSaver.getUri(e);
    expect(uri).toContain('data:image/svg+xml;base64');
  });

});
