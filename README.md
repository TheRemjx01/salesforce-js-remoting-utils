# Salesforce Javascript Remoting Utilities

## Install:
Install salesforce-js-remoting-utils from npm:

`npm i salesforce-js-remoting-utils --save`

## Usage:
### `NgJSRemoteService` Utility
Feature: Auto generate Ng Promise Api for jsMethod in `AngularJS` application.

Usage
```
    // allApis.js
    /** Define all your Apex @RemoteAction */
    export default allApis {
            demo: {
                    jsRemoteMethod: 'demo', // name of @RemoteAction
                    sfController: 'SPP_HomeCC' // name of Apex Controller that has remote method
            },
            demoWithParams: {
                    jsRemoteMethod: 'demoWithParams',
                    sfController: 'SPP_HomeCC'
            },
    }    
    
    
    // app.module.js
    import {NgJSRemoteService} from 'salesforce-js-remoting-utils';
    
    const app = angular.module('myApp', $globalInject)
        .service('DemoService', DemoService)
        .service('JSRemoteService', JSRemoteService)
        
    // demo.service.js
    /** ES-6 Syntax*/
    import allApis from '../path/to/allApis.js'
    
    export default class DemoService {
        static get $inject() {
                return ['JSRemoteService']
        }
        
        constructor(JSRemoteService){
                this.JSRemoteService = JSRemoteService;
        }
        
        demoGetApi() {
            const demo = this.JSRemoteService.getNgApi(allApis.demo);
            demo().then(res => {
                console.log('Res', res);
            })
        }
        
        demoGetApiWithParams() {
            const demoWithParams = this.JSRemoteService.getNgApi(allApis.demoWithParams);
            demoWithParams(param1, param2 , ...).then(res => {
                console.log('Res: ', res)
            })
        }
    }
```

### `JSRemote`

Feature: Apply Callback to Javascript Remote
Usage:
```
    import {JSRemote} from 'salesforce-js-remoting-utils'
    
    const demoCallback =(res) => {
        console.log('Bingo, Response Found: ', res);    
    }
    
    const remoteApi = {
        jsRemoteMethod: 'Demo',
        sfController: 'SPP_HomeCC',
        handler: demoCallback
    };
    
    const jsApiGenerator = new JSRemote(remoteApi.jsRemoteMethod, remoteApi.sfController, remoteApi.handler);
    
    // call api 
    // not has params
    jsApiGenerator.api();
    
    // pass params in jsApiGenerator.api(... params...)
    jsApiGenerator.api(param1, param2, ...); // output: 'Bingo, Response Found: ...Message From Api...'
```


### `NgJSRemote`
Feature: Create a Promise Api that inject `$q` and `$rootScope`
Usage:
```
    
    // demo.service.js
    /** ES-6 Syntax*/
    import {NgJSRemote} from 'salesforce-js-remoting-utils'
    
    export default class DemoService {
        demoApiHandler; // target handler    
        // MUST INJECT $q and $rootScope to work!!!
        static get $inject() {
                return ['$q', '$rootScope']
        }
        
        
        constructor($q, $rootScope){
            const remoteApi = {
                jsRemoteMethod: 'Demo',
                sfController: 'SPP_HomeCC',
            }
            // remember to pass $q and $rootScope to NgJSRemote()
            const apiGenerator = new NgJSRemote(
                                    remoteApi.jsRemoteMethod,
                                    remoteApi.sfController, 
                                    $q, 
                                    $rootScope
                                );
             this.demoApiHandler = apiGenerator.promiseApi();
             // to call api do this:
             this.demoApiHandler().then(res => {
                /** Do whatever you want*/
                /*...*/             
             }); // without any params
             this.demoApiHandler(param1, param2, ...).then(res => {
                /** Do whatever you want*/
                /*...*/             
             }); // with params
        }
        
    }
    
    // demo.controller.js
    /** Demo usage in controller*/
    export default class DemoController {
        static get $inject() {
            return ['DemoService']
        }
        
        constructor(DemoService) {
            // call api
            DemoService.demoApiHandler().then(res => {
                /** Handling response here */
            })
        }
    }
    
```
## Next Step:
### 1. Create `ReduxJSRemoteStore` OR `MobxJSRemoteStore` for React Application
### 2. Create `NG4JSRemoteService` for Angular 4 Applications
