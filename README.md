## Cettia JavaScript Client
[![Travis](https://img.shields.io/travis/cettia/cettia-javascript-client.svg)](https://travis-ci.org/cettia/cettia-javascript-client) [![npm](https://img.shields.io/npm/v/cettia-client.svg)](https://www.npmjs.com/package/cettia-client) [![GitHub license](https://img.shields.io/github/license/cettia/cettia-javascript-client.svg)](https://github.com/cettia/cettia-javascript-client/blob/master/LICENSE)

Cettia JavaScript Client is a lightweight JavaScript client for browser-based and Node-based application.

For more information on the project, please see the [website](http://cettia.io/projects/cettia-javascript-client).

### Using with Node...

To require the code for a browser bundle:

```
$ npm install --save cettia-client
```

```
// es6 import
import cettia from 'cettia-client';

// or require
var cettia = require('cettia-client');
```

### Using with bundlers webpack/browserify/etc...

To require the code for a browser bundle:

NPM install
```
$ npm install --save cettia-client
```

```
// es6 import
import cettia from 'cettia-client/cettia-bundler';

// or require
var cettia = require('cettia-client/cettia-bundler');
```

### Using in an embedded script tag

Copy the cettia-browser.min.js file from this repo into your project's public folder.

```
<script src="path/to/cettia/cettia-browser.min.js" />
```
