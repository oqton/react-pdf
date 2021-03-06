import _extends from "@babel/runtime/helpers/esm/extends";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import pdfjs from 'pdfjs-dist';
import makeCancellable from 'make-cancellable-promise';
import DocumentContext from '../DocumentContext';
import PageContext from '../PageContext';
import { callIfDefined, cancelRunningTask, errorOnDev } from '../shared/utils';
import { isLinkService, isPage, isRotate } from '../shared/propTypes';
export var AnnotationLayerInternal = /*#__PURE__*/function (_PureComponent) {
  _inherits(AnnotationLayerInternal, _PureComponent);

  function AnnotationLayerInternal() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, AnnotationLayerInternal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AnnotationLayerInternal)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      annotations: null
    });

    _defineProperty(_assertThisInitialized(_this), "loadAnnotations", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var page, cancellable, annotations;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              page = _this.props.page;
              _context.prev = 1;
              cancellable = makeCancellable(page.getAnnotations());
              _this.runningTask = cancellable;
              _context.next = 6;
              return cancellable.promise;

            case 6:
              annotations = _context.sent;

              _this.setState({
                annotations: annotations
              }, _this.onLoadSuccess);

              _context.next = 13;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](1);

              _this.onLoadError(_context.t0);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 10]]);
    })));

    _defineProperty(_assertThisInitialized(_this), "onLoadSuccess", function () {
      var onGetAnnotationsSuccess = _this.props.onGetAnnotationsSuccess;
      var annotations = _this.state.annotations;
      callIfDefined(onGetAnnotationsSuccess, annotations);
    });

    _defineProperty(_assertThisInitialized(_this), "onLoadError", function (error) {
      _this.setState({
        annotations: false
      });

      errorOnDev(error);
      var onGetAnnotationsError = _this.props.onGetAnnotationsError;
      callIfDefined(onGetAnnotationsError, error);
    });

    _defineProperty(_assertThisInitialized(_this), "onRenderSuccess", function () {
      var onRenderAnnotationLayerSuccess = _this.props.onRenderAnnotationLayerSuccess;
      callIfDefined(onRenderAnnotationLayerSuccess);
    });

    _defineProperty(_assertThisInitialized(_this), "onRenderError", function (error) {
      errorOnDev(error);
      var onRenderAnnotationLayerError = _this.props.onRenderAnnotationLayerError;
      callIfDefined(onRenderAnnotationLayerError, error);
    });

    return _this;
  }

  _createClass(AnnotationLayerInternal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var page = this.props.page;

      if (!page) {
        throw new Error('Attempted to load page annotations, but no page was specified.');
      }

      this.loadAnnotations();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          page = _this$props.page,
          renderInteractiveForms = _this$props.renderInteractiveForms;

      if (prevProps.page && page !== prevProps.page || renderInteractiveForms !== prevProps.renderInteractiveForms) {
        this.loadAnnotations();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      cancelRunningTask(this.runningTask);
    }
  }, {
    key: "renderAnnotationLayer",
    value: function renderAnnotationLayer() {
      var annotations = this.state.annotations;

      if (!annotations) {
        return;
      }

      var _this$props2 = this.props,
          linkService = _this$props2.linkService,
          page = _this$props2.page,
          renderInteractiveForms = _this$props2.renderInteractiveForms;
      var viewport = this.viewport.clone({
        dontFlip: true
      });
      var parameters = {
        annotations: annotations,
        div: this.annotationLayer,
        linkService: linkService,
        page: page,
        renderInteractiveForms: renderInteractiveForms,
        viewport: viewport
      };
      this.annotationLayer.innerHTML = '';

      try {
        pdfjs.AnnotationLayer.render(parameters);
        this.onRenderSuccess();
      } catch (error) {
        this.onRenderError(error);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement("div", {
        className: "react-pdf__Page__annotations annotationLayer",
        ref: function ref(_ref2) {
          _this2.annotationLayer = _ref2;
        }
      }, this.renderAnnotationLayer());
    }
  }, {
    key: "viewport",
    get: function get() {
      var _this$props3 = this.props,
          page = _this$props3.page,
          rotate = _this$props3.rotate,
          scale = _this$props3.scale;
      return page.getViewport({
        scale: scale,
        rotation: rotate
      });
    }
  }]);

  return AnnotationLayerInternal;
}(PureComponent);
AnnotationLayerInternal.propTypes = {
  linkService: isLinkService.isRequired,
  onGetAnnotationsError: PropTypes.func,
  onGetAnnotationsSuccess: PropTypes.func,
  onRenderAnnotationLayerError: PropTypes.func,
  onRenderAnnotationLayerSuccess: PropTypes.func,
  page: isPage,
  renderInteractiveForms: PropTypes.bool,
  rotate: isRotate,
  scale: PropTypes.number
};

var AnnotationLayer = function AnnotationLayer(props) {
  return React.createElement(DocumentContext.Consumer, null, function (documentContext) {
    return React.createElement(PageContext.Consumer, null, function (pageContext) {
      return React.createElement(AnnotationLayerInternal, _extends({}, documentContext, pageContext, props));
    });
  });
};

export default AnnotationLayer;