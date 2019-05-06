# Cettia JavaScript Client

Cettia JavaScript Client is a lightweight JavaScript client for browser-based and Node-based application and distributed via the npm registry with the name, [cettia-client](https://www.npmjs.com/package/cettia-client).

## Installation

### `script` tag

Add the following script tag to your HTML.

```html
<script src="https://cdn.jsdelivr.net/npm/cettia-client/cettia-browser.min.js"></script>
```
```javascript
window.cettia;
```

### Bundler

Install and load the package.

```
npm install cettia-client
```
```javascript
var cettia = require('cettia-client/cettia-bundler');
```

Note: You should use this way to use Cettia in React Native.

### Node

Install and load the package.

```
npm install cettia-client
```
```javascript
var cettia = require('cettia-client');
```

## Usage

Cettia will be familiar to people using other real-time web frameworks and libraries. You open a socket and send and receive events with Cettia's API. Here is the main.js contents which is a Node example of the Cettia Starter Kit.

```javascript
const cettia = require("cettia-client");
const username = "DH";
const uri = `http://localhost:8080/cettia?username=${encodeURIComponent(username)}`;
const socket = cettia.open(uri);

const addMessage = ({sender, text}) => console.log(`${sender} sends ${text}`);
socket.on("message", addMessage);

const addSystemMessage = text => addMessage({sender: "system", text});
socket.on("connecting", () => addSystemMessage("The socket starts a connection."));
socket.on("open", () => addSystemMessage("The socket establishes a connection."));
socket.on("close", () => addSystemMessage("All transports failed to connect or the connection was disconnected."));
socket.on("waiting", (delay) => addSystemMessage(`The socket will reconnect after ${delay} ms`));

// Once a socket has opened, sends a message every 5 seconds
socket.once("open", () => setInterval(() => socket.send("message", {text: `A message - ${Date.now()}`}), 5000));
```

Besides a Node example, the Cettia starter kit provides Web example and React Native example which demonstrate how you can use Cettia JavaScript Client in various runtime environment.

## See Also

- [Getting Started](https://cettia.io/guides/getting-started/)
- [Cettia Starter Kit](https://github.com/cettia/cettia-starter-kit)
- [Building Real-Time Web Applications With Cettia](https://cettia.io/guides/cettia-tutorial) 
- [Various demo applications using Cettia and Spring 5](https://github.com/ralscha/cettia-demo) by Ralph Schaer
- [Real-time messaging with Cettia and Spring Boot](https://golb.hplar.ch/2019/01/cettia-springboot.html) by Ralph Schaer
