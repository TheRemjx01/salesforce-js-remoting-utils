export class JSRemote {
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

export class NgJSRemote extends JSRemote {
    $q;
    $rootScope;
    constructor(jsRemoteMethod, sfController, $q, $rootScope) {
        super(jsRemoteMethod, sfController);
        this.$q = $q;
        this.$rootScope = $rootScope;

    }

    get promiseApi() {
        let api;
        const deferred = this.$q.defer();
        this.handler = (res) => {
            this.$rootScope.$apply(() => {
                deferred.resolve(res)
            })
        };
        try {
            api = this.api;
        } catch (e) {
            throw('Can get\'t promise api because of error api')
        }
        return function() {
            try{
                api(...arguments);
            } catch (e) {
                throw e;
            }

            return deferred.promise;
        }
    }
}

export class NgJSRemoteService {
    static get $inject() {
        return ['$q', '$rootScope'];
    } ;

    constructor($q, $rootScope) {
        this.$q = $q;
        this.$rootScope = $rootScope;
    }


    getNgApi(apiItem) {
        const {jsRemoteMethod, sfController} = apiItem;
        const ngRemote = new NgJSRemote(jsRemoteMethod, sfController, this.$q, this.$rootScope);
        return ngRemote.promiseApi;
    }
}