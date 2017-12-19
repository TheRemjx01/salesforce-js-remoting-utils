'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSRemote = exports.JSRemote = function () {
    function JSRemote(jsRemoteMethod, sfController, handler) {
        _classCallCheck(this, JSRemote);

        this.jsRemoteMethod = jsRemoteMethod;
        this.sfController = sfController;
        this.handler = handler;
    }

    _createClass(JSRemote, [{
        key: 'validateApi',
        value: function validateApi() {
            if (!this.handler || !this.handler instanceof Function) {
                return 'Callback is not instance of function';
            }
        }
    }, {
        key: 'api',
        get: function get() {
            var err = this.validateApi();
            if (err) {
                throw err;
            }
            var remoteCallName = this.sfController + '.' + this.jsRemoteMethod;
            var self = this;
            return function () {
                var _Visualforce$remoting;

                var spreadParams = [].concat(Array.prototype.slice.call(arguments));
                (_Visualforce$remoting = Visualforce.remoting.Manager).invokeAction.apply(_Visualforce$remoting, [remoteCallName].concat(_toConsumableArray(spreadParams), [self.handler, { escape: false }]));
            };
        }
    }]);

    return JSRemote;
}();

var NgJSRemote = exports.NgJSRemote = function (_JSRemote) {
    _inherits(NgJSRemote, _JSRemote);

    function NgJSRemote(jsRemoteMethod, sfController, $q, $rootScope) {
        _classCallCheck(this, NgJSRemote);

        var _this = _possibleConstructorReturn(this, (NgJSRemote.__proto__ || Object.getPrototypeOf(NgJSRemote)).call(this, jsRemoteMethod, sfController));

        _this.$q = $q;
        _this.$rootScope = $rootScope;

        return _this;
    }

    _createClass(NgJSRemote, [{
        key: 'promiseApi',
        get: function get() {
            var _this2 = this;

            var api = void 0;
            var deferred = this.$q.defer();
            this.handler = function (res) {
                _this2.$rootScope.$apply(function () {
                    deferred.resolve(res);
                });
            };
            try {
                api = this.api;
            } catch (e) {
                throw 'Can get\'t promise api because of error api';
            }
            return function () {
                api.apply(undefined, arguments);
                return deferred.promise;
            };
        }
    }]);

    return NgJSRemote;
}(JSRemote);

var VFRemotingService = exports.VFRemotingService = function () {
    _createClass(VFRemotingService, null, [{
        key: '$inject',
        get: function get() {
            return ['$q', '$rootScope'];
        }
    }]);

    // inject

    function VFRemotingService($q, $rootScope) {
        _classCallCheck(this, VFRemotingService);

        this.$q = $q;
        this.$rootScope = $rootScope;
    }

    _createClass(VFRemotingService, [{
        key: 'getNgApi',
        value: function getNgApi(apiItem) {
            var jsRemoteMethod = apiItem.jsRemoteMethod,
                sfController = apiItem.sfController;

            var ngRemote = new NgJSRemote(jsRemoteMethod, sfController, this.$q, this.$rootScope);
            return ngRemote.promiseApi;
        }
    }]);

    return VFRemotingService;
}();