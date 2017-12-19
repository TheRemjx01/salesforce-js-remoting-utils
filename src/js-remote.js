export default class JSRemote {
    jsRemoteMethod;
    sfController;
    handler;
    constructor(jsRemoteMethod, sfController, handler) {
        this.jsRemoteMethod = jsRemoteMethod;
        this.sfController = sfController;
        this.handler = handler;
    }

    get api() {
        const err = this.validateApi();
        if (err) {
            throw err;
        }
        const remoteCallName = `${this.sfController}.${this.jsRemoteMethod}`;
        const self = this;
        return function() {
            const spreadParams = [...arguments];
            Visualforce.remoting.Manager.invokeAction(
                remoteCallName,
                ...spreadParams, self.handler, {escape: false}
            );
        };
    }

    validateApi() {
        if (!this.handler || !this.handler instanceof Function) {
            return 'Callback is not instance of function'
        }
    }
}
