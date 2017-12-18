'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function validateRemotingApi(remoteApi) {
    for (var key in remoteApi) {
        if (!remoteApi.hasOwnProperty(key)) {
            return 'Missing Any Api Key is prohibited';
        }
    }
    if (!remoteApi.callback || !remoteApi.callback instanceof Function) {
        return 'Callback is not instance of function';
    }
}
exports.generateAllApis = function (allRemotingApis) {
    return allRemotingApis.reduce(function (apis, remoteApi) {
        // check empty
        var err = validateRemotingApi(remoteApi);
        if (err) {
            throw err;
        }

        // check callback is function
        // const {jsRemoteMethod, sfController, callback, outputMethod} = remoteApi;
        // const remoteCallName = `${sfController}.${jsRemoteMethod}`;

        var _generateApi = generateApi(remoteApi),
            outputMethod = _generateApi.outputMethod,
            outputFunc = _generateApi.outputFunc;

        apis[outputMethod] = outputFunc;
        return apis;
    }, {});
};

exports.generateApi = function (remoteApi) {
    var err = validateRemotingApi(remoteApi);
    if (err) {
        throw err;
    }
    var jsRemoteMethod = remoteApi.jsRemoteMethod,
        sfController = remoteApi.sfController,
        callback = remoteApi.callback,
        outputMethod = remoteApi.outputMethod;

    var remoteCallName = sfController + '.' + jsRemoteMethod;
    var outputFunc = function outputFunc(allParams) {
        var _Visualforce$remoting;

        var spreadParams = [].concat(Array.prototype.slice.call(arguments));
        (_Visualforce$remoting = Visualforce.remoting.Manager).invokeAction.apply(_Visualforce$remoting, [remoteCallName].concat(_toConsumableArray(spreadParams), [callback, { escape: false }]));
    };
    return {
        outputMethod: outputMethod,
        outputFunc: outputFunc
    };
};