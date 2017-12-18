exports.generateAllApis = function (allRemotingApis) {
    return allRemotingApis.reduce((apis, remoteApi) => {
        // check empty
        for (let key in remoteApi) {
        if (!remoteApi.hasOwnProperty(key)) {
            throw 'Missing Any Api Key is prohibited';
        }
    }

    if (!remoteApi.callback || !remoteApi.callback instanceof Function) {
        throw 'Callback is not instance of function'
    }

    // check callback is function
    const {jsRemoteMethod, sfController, callback, outputMethod} = remoteApi;
    const remoteCallName = `${sfController}.${jsRemoteMethod}`;
    apis[outputMethod] = function(allParams) {
        const spreadParams = [...arguments];
        Visualforce.remoting.Manager.invokeAction(
            remoteCallName,
            ...spreadParams, callback, {escape: false}
    );
    };
    return apis;
}, {})
};