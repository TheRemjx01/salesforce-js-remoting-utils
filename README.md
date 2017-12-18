# Salesforce Javascript Remoting Utilities

## Updates:
### Add Angular Remoting Service Utility

## Features:
### Auto generate all javascript remoting methods


### Steps configuration

1. Install this package: `npm i salesforce-js-remoting-utils`
2. Declare all your remoting action in an array

Example:
```
    const allRemotingApis = [
        {
            jsRemoteMethod: 'example1',                 // method from your Apex Controller
            sfController: 'SPP_HomeCC',                 // Apex Controller name
            outputMethod: 'example1WithCallback',       // your expected output method
            callback: example1ApiHandler                // your wanted callback
        },
        {
            jsRemoteMethod: 'example2',
            sfController: 'SPP_HomeCC',
            outputMethod: 'example2WithCallback',
            callback: example2ApiHandler
        },
        {
            jsRemoteMethod: 'example3',
            sfController: 'SPP_HomeCC',
            outputMethod: 'example3WithCallback',
            callback: example3ApiHandler
        }
    ];
```

3. Call `generateAllApis`. Example:
```
    // ES-6 Syntax
    import sfJsRemotingUtils from 'salesforce-js-remoting-utils';
    import allRemotingApis from '../path/to/your/allRemotingApis';
    const allApis = sfJSRemotingUtils.generateAllApis(allRemotingApis)
```
4. Then you can call your method like this to fire `RemoteAction`. Example:
```
    // ES6 syntax
    const {example1WithCallback, example2WithCallback, example3WithCallback} = allApis;
    example1WithCallback(param1, param2, ...)
```