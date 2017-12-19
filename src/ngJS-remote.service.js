import NgJSRemote from "./ngJS-remote";

export default class NgJSRemoteService {
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