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
