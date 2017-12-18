function validateRemotingApi(remoteApi) {
    for(let key in remoteApi) {
        if (!remoteApi.hasOwnProperty(key)) {
            return 'Missing Any Api Key is prohibited'
        }
    }
    if (!remoteApi.callback || !remoteApi.callback instanceof Function) {
        return 'Callback is not instance of function'
    }
}
exports.generateAllApis = function (allRemotingApis) {
    return allRemotingApis.reduce((apis, remoteApi) => {
        // check empty
        const err = validateRemotingApi(remoteApi);
        if (err) {
            throw err
        }

    // check callback is function
    // const {jsRemoteMethod, sfController, callback, outputMethod} = remoteApi;
    // const remoteCallName = `${sfController}.${jsRemoteMethod}`;
    const {outputMethod, outputFunc} = generateApi(remoteApi);
    apis[outputMethod] = outputFunc;
    return apis;
}, {})
};

exports.generateApi = function(remoteApi) {
    const err = validateRemotingApi(remoteApi);
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
};