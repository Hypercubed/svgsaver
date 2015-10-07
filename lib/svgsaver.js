'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _collection = require('./collection');

var _clonesvg = require('./clonesvg');

var _clonesvg2 = _interopRequireDefault(_clonesvg);

var _saveuri = require('./saveuri');

var _saveuri2 = _interopRequireDefault(_saveuri);

var _utils = require('./utils');

var SvgSaver = (function () {
  function SvgSaver() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, SvgSaver);

    this.attrs = opts.attrs === undefined ? _collection.svgAttrs : opts.attrs;
    this.styles = opts.styles === undefined ? _collection.svgStyles : opts.styles;
  }

  _createClass(SvgSaver, [{
    key: 'getHTML',
    value: function getHTML(el) {
      var svg = (0, _clonesvg2['default'])(el, this.attrs, this.styles);

      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('version', 1.1);

      svg.setAttribute('width', svg.getAttribute('width') || '500');
      svg.setAttribute('height', svg.getAttribute('height') || '900');

      return svg.outerHTML || new window.XMLSerializer().serializeToString(svg);
    }
  }, {
    key: 'getBlob',
    value: function getBlob(el) {
      var html = this.getHTML(el);
      return new Blob([html], { type: 'text/xml' });
    }
  }, {
    key: 'getUri',
    value: function getUri(el) {
      var html = this.getHTML(el);
      if ((0, _utils.isDefined)(window.btoa)) {
        return 'data:image/svg+xml;base64,' + window.btoa(html);
      }
      return 'data:image/svg+xml,' + encodeURIComponent(html);
    }
  }, {
    key: 'asSvg',
    value: function asSvg(el, filename) {
      if (!filename || filename === '') {
        filename = el.getAttribute('title');
        filename = (filename || 'untitled') + '.svg';
      }

      if ((0, _utils.isDefined)(window.saveAs) && (0, _utils.isFunction)(Blob)) {
        saveAs(this.getBlob(el), filename);
      } else {
        saveUri(this.getUri(el), filename);
      }
      return this;
    }
  }, {
    key: 'asPng',
    value: function asPng(el, filename) {
      if (!filename || filename === '') {
        filename = el.getAttribute('title');
        filename = (filename || 'untitled') + '.png';
      }

      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');

      var image = new Image();
      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        if ((0, _utils.isDefined)(window.saveAs) && (0, _utils.isDefined)(canvas.toBlob)) {
          canvas.toBlob(function (blob) {
            saveAs(blob, filename);
          });
        } else {
          var uri = canvas.toDataURL('image/png');
          saveUri(uri, filename);
        }
      };
      image.src = this.getUri(el);
      return true;
    }
  }]);

  return SvgSaver;
})();

exports.SvgSaver = SvgSaver;
exports['default'] = SvgSaver;
//# sourceMappingURL=svgsaver.js.map