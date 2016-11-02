## Cettia JavaScript Client
[![Travis](https://img.shields.io/travis/cettia/cettia-javascript-client.svg)](https://travis-ci.org/cettia/cettia-javascript-client) [![npm](https://img.shields.io/npm/v/cettia-client.svg)](https://www.npmjs.com/package/cettia-client) [![GitHub license](https://img.shields.io/github/license/cettia/cettia-javascript-client.svg)](https://github.com/cettia/cettia-javascript-client/blob/master/LICENSE)

Cettia JavaScript Client is a lightweight JavaScript client for browser-based and Node-based application.

For more information on the project, please see the [website](http://cettia.io/projects/cettia-javascript-client).

### Using with webpack:

If using with node.js, there are a number of polyfills that are imported. If you're in a browser environment, you don't need those polyfills and need webpack to not include them.

In your JS:
```
import cettia;
var socket = cettia.open(url, {reconnect});
```

Then in your webpack conf:
```
var processEnvPlugin = new webpack.DefinePlugin({
    "typeof window": JSON.stringify("object")
    // Cettia has a check for (typeof window !== "object")
    // to determine if your using node or the browser.
});

module.exports = {
    ...
    plugins: [
        processEnvPlugin
    ]
}
```

The [Define Plugin](https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin) allows you to define global variables and strip out code based on those variables.  It will remove the code for if process.env
