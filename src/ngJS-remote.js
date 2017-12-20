import { JSRemote } from "./js-remote";

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
