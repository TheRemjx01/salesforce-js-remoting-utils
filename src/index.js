function validateRemotingApi(remoteApi, isSingleApi) {
    if(!isSingleApi) {
        for(let key in remoteApi) {
            if (!remoteApi.hasOwnProperty(key)) {
                return 'Missing Any Api Key is prohibited'
            }
        }
    }

    if (!remoteApi.callback || !remoteApi.callback instanceof Function) {
        return 'Callback is not instance of function'
    }
}
exports.generateAllApis = function (allRemotingApis) {
    return allRemotingApis.reduce((apis, remoteApi) => {
    // check empty
    const {outputMethod, outputFunc} = generateApiPrivate(remoteApi);
    apis[outputMethod] = outputFunc;
    return apis;
}, {})
};

 function generateApiPrivate(remoteApi) {
    const err = validateRemotingApi(remoteApi, false);
    if (err) {
        throw err
    }
    const {jsRemoteMethod, sfController, callback, outputMethod} = remoteApi;
    const remoteCallName = `${sfController}.${jsRemoteMethod}`;
    const outputFunc = function(allParams) {
        const spreadParams = [...arguments];
        Visualforce.remoting.Manager.invokeAction(
            remoteCallName,
            ...spreadParams, callback, {escape: false}
        );
    };
    return {
      outputMethod,
      outputFunc
    }
}

exports.generateApi= function(remoteApi) {
    const err = validateRemotingApi(remoteApi, true);
    if (err) {
        throw err
    }
    const {jsRemoteMethod, sfController, callback} = remoteApi;
    const remoteCallName = `${sfController}.${jsRemoteMethod}`;
    return function(allParams) {
        const spreadParams = [...arguments];
        Visualforce.remoting.Manager.invokeAction(
            remoteCallName,
            ...spreadParams, callback, {escape: false}
        );
    };
};