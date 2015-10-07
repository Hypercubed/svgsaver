
describe('svgsaver#getHTML', function() {

  var svgSaver = new SvgSaver();

  document.body.innerHTML += '<style>rect { stroke-opacity: 0.75; }</style>';
  document.body.innerHTML += '<svg id="svg-0"><rect ng-scope x="10" y="10" height="100" width="100" style="opacity: 0.5;"/></svg>';

  it('should convert SVG element', function() {
    var e = document.querySelector('#svg-0');
    var html = svgSaver.getHTML(e);
    expect(html).toContain('<svg');
  });

	it('should convert SVG element with children', function() {
    var e = document.querySelector('#svg-0');
		var html = svgSaver.getHTML(e);
    expect(html).toContain('<rect');
	});

  it('should convert SVG element with styles', function() {
    var e = document.querySelector('#svg-0');
    var html = svgSaver.getHTML(e);
    expect(html).toContain('opacity: 0.5;');
  });

  it('should convert SVG element with CSS defined styles', function() {
    var e = document.querySelector('#svg-0');
    var html = svgSaver.getHTML(e);
    expect(html).toContain('stroke-opacity: 0.75;');
  });

  it('should convert SVG element removing unneeded attrs', function() {
    var e = document.querySelector('#svg-0');
    var html = svgSaver.getHTML(e);
    expect(html).not.toContain('ng-scope');
  });

});

describe('svgsaver options', function() {

  document.body.innerHTML += '<style>rect { stroke-opacity: 0.75; fill-opacity: 0.25; }</style>';
  document.body.innerHTML += '<svg id="svg-0"><rect ng-scope x="10" y="10" height="100" width="100" style="opacity: 0.5;"/></svg>';

  it('should remove all attributes and styles when false', function() {

    var svgSaver = new SvgSaver({
      styles: false,
      attrs: false
    });

    var e = document.querySelector('#svg-0');
    var html = svgSaver.getHTML(e);
    //console.log('clean',html);
    expect(html).not.toContain('opacity: 0.5;');
    expect(html).not.toContain('stroke-opacity: 0.75;');
    expect(html).not.toContain('ng-scope');
    expect(html).not.toContain('x="10"');
    expect(html).not.toContain('y="10"');
  });

  it('should remove all attributes and styles when empty', function() {

    var svgSaver = new SvgSaver({
      styles: {},
      attrs: []
    });

    var e = document.querySelector('#svg-0');
    var html = svgSaver.getHTML(e);
    //console.log('clean',html);
    expect(html).not.toContain('opacity: 0.5;');
    expect(html).not.toContain('stroke-opacity: 0.75;');
    expect(html).not.toContain('ng-scope');
    expect(html).not.toContain('x="10"');
    expect(html).not.toContain('y="10"');
  });

  it('should retain inline styles and CSS styles in whitelist', function() {

    var svgSaver = new SvgSaver({
      styles: {
        'stroke-opacity':'1'
      },
      attrs: ['style']
    });

    var e = document.querySelector('#svg-0');
    var html = svgSaver.getHTML(e);
    //console.log('min',html);
    expect(html).toContain('opacity: 0.5;');
    expect(html).toContain('stroke-opacity: 0.75;');
    expect(html).not.toContain('ng-scope');
    expect(html).not.toContain('x="10"');
    expect(html).not.toContain('y="10"');
  });

  it('should retain inline styles and attributes in whitelist', function() {

    var svgSaver = new SvgSaver({
      styles: {
        'stroke-opacity':'1'
      },
      attrs: ['style', 'ng-scope','x']
    });

    var e = document.querySelector('#svg-0');
    var html = svgSaver.getHTML(e);
    //console.log('min',html);
    expect(html).toContain('opacity: 0.5;');
    expect(html).toContain('stroke-opacity: 0.75;');
    expect(html).toContain('ng-scope');
    expect(html).toContain('x="10"');
    expect(html).not.toContain('y="10"');
  });

  it('should copy all attributes and styles when true', function() {

    var svgSaver = new SvgSaver({
      attrs: true,  // copy all attributes
      styles: true  // copy all styles
    });

    var e = document.querySelector('#svg-0');
    var html = svgSaver.getHTML(e);
    //console.log('all',html);
    expect(html).toContain('opacity: 0.5;');
    expect(html).toContain('stroke-opacity: 0.75;');
    expect(html).toContain('ng-scope');
    expect(html).toContain('x="10"');
    expect(html).toContain('y="10"');
  });

});

describe('svgsaver#getBlob', function() {

  var svgSaver = new SvgSaver();

  if (typeof window.Blob !== 'function') {
    window.Blob = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  }

  document.body.innerHTML += '<style>rect { fill: #0000ff; }</style>';
  document.body.innerHTML += '<svg id="svg-0"><rect ng-scope x="10" y="10" height="100" width="100" style="stroke:#ff0000;"/></svg>';

  it('should convert SVG element', function() {
    var e = document.querySelector('#svg-0');
    var blob = svgSaver.getBlob(e);
    expect(blob instanceof Blob);
  });

});

describe('svgsaver#getUri', function() {

  var svgSaver = new SvgSaver();

  if (typeof window.Blob !== 'function') {
    window.Blob = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  }

  document.body.innerHTML += '<style>rect { fill: #0000ff; }</style>';
  document.body.innerHTML += '<svg id="svg-0"><rect ng-scope x="10" y="10" height="100" width="100" style="stroke:#ff0000;"/></svg>';

  it('should convert SVG element', function() {
    var e = document.querySelector('#svg-0');
    var uri = svgSaver.getUri(e);
    expect(uri).toContain('data:image/svg+xml;base64');
  });

});
