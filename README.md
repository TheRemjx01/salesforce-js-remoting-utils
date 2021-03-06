# Salesforce Javascript Remoting Utilities

## Install:
Install salesforce-js-remoting-utils from npm:

`npm i salesforce-js-remoting-utils --save`

## From CDN:
https://unpkg.com/salesforce-js-remoting-utils/dist/index


## Usage:
### `NgJSRemoteService` Utility
Feature: Auto generate Ng Promise Api for jsMethod in `AngularJS` application.

Usage:
`NodeJS/Webpack + ES-6`
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
Usage: In Visualforce page: `In Browser, before ES-6`.
1. Require `<script type="text/javascript" src="https://unpkg.com/salesforce-js-remoting-utils/dist/sf-remote-utils.js"></script>`
2. Require `<script type="text/javascript" src="path/to/angular.js"></script>`
3. Register your controller `<apex:page controller="HelloWordCCDemo">`
4. Register NgJsRemoteService: `app.service('remoteService', sfRemoteUtils.NgJSRemoteService);`
5. Inject to your controller: `app.controller('demo', ['$scope', 'remoteService', function($scope, remoteService) `
6. Declare your `apiName` is object that has 2 attribute : `{jsRemoteMethod: 'methodName',sfController: 'controllerName'},
`
7. Get your angular `promiseApi` by call: ` remoteService.getNgApi(allApis.apiName)`
 
 Example:

```
<!-- your vf page looks like-->
<apex:page controller="HelloWordCCDemo">
    <html>
        <head>
            <script type="text/javascript" src="https://unpkg.com/salesforce-js-remoting-utils/dist/sf-remote-utils.js"></script>
            <script type="text/javascript" src="path/to/angular.js"></script>
        </head>
        <body ng-app="ng-app">
            <div ng-controller="demo">
                <h1>TEST REMOTING</h1><br/>
                <h1>{{hello}}</h1><br/>
                <button type="button" ng-click="onHiBtnClick()">Call Remoting</button>
                <hr/>
                <h1>TEST REMOTING WITH PARAMS</h1><br/>
                <h1>{{hello2}}</h1><br/>
                <table>
                    <tr>
                        <td><label for="userName">Username: </label></td>
                        <td>
                            <input name="userName" type="text" ng-model="userName"/><br/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="email">Email: </label>
                        </td>
                        <td>
                            <input type="text" ng-model="email"/><br/>
                        </td>
                    </tr>
                </table>

                <button type="button" ng-click="onHiWithParamsBtnClick()">
                    Call Remoting With Params
                </button>
            </div>
        </body>
        <script>
            var allApis = {
                Hi: {
                    jsRemoteMethod: 'Hi',
                    sfController: 'HelloWordCCDemo'
                },
                HiWithParams: {
                    jsRemoteMethod: 'HiWithParams',
                    sfController: 'HelloWordCCDemo'
                }
            };
            var app = angular.module('ng-app', []);
            app.service('remoteService', sfRemoteUtils.NgJSRemoteService);
            app.controller('demo', ['$scope', 'remoteService', function($scope, remoteService) {
                $scope.userName = '';
                $scope.email = '';
                $scope.hello = 'Hello World';
                $scope.hello2 = 'No content';
                console.log('$SCOPE HELLO: ', $scope.hello);
                // call without params
                $scope.onHiBtnClick = function() {
                    remoteService.getNgApi(allApis.Hi)().then(function(res){
                        console.log('VF SERVICE RESPONSE: ', res);
                        $scope.hello = res;
                    })
                };
                // call with params
                $scope.onHiWithParamsBtnClick = function() {
                    console.log('$SCOPE USER NAME: ', $scope.userName, $scope.email);
                    const demoRequest = {userName: $scope.userName, email: $scope.email};
                    remoteService.getNgApi(allApis.HiWithParams)(demoRequest).then(function(res){
                        console.log('VF SERVICE RESPONSE: ', res);
                        $scope.hello2 = res;
                    })
                };
            }])
        </script>
    </html>
</apex:page>
<!-- End vf page -->


// your apex class look like
public class HelloWordCCDemo {
	public class HelloWordRequest {
		public String userName {get;set;}
		public String email {get;set;}
	}

	@RemoteAction
	public static String Hi() {
		HelloWordRequest req = new HelloWordRequest();
		req.userName = 'Nghia';
		req.email = 'nguyen.nghia@mulodo.com';
		return 'Hello User: ' + req.userName + 'Your email is: ' + req.email;
	}

	@RemoteAction
	public static String HiWithParams(HelloWordRequest req) {
		return 'Hello User: ' + req.userName + 'Your email is: ' + req.email;
	}
}

```
IMPORTANT NOTE: Remember to register controller to VF page or you will caught `Visualforce is undefined`

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
