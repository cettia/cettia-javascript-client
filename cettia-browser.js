var cettia =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _msgpackLite = __webpack_require__(1);

	var _msgpackLite2 = _interopRequireDefault(_msgpackLite);

	var _traverse = __webpack_require__(27);

	var _traverse2 = _interopRequireDefault(_traverse);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// A global identifier

	/*
	 * Cettia v1.0.0-Beta2
	 * http://cettia.io/projects/cettia-javascript-client/
	 * 
	 * Copyright 2015 the original author or authors.
	 * Licensed under the Apache License, Version 2.0
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	var guid = 1;
	// Prototype shortcuts
	var slice = Array.prototype.slice;
	// Variables for Node
	var document = window.document;
	var location = window.location;
	var navigator = window.navigator;
	var XMLHttpRequest = window.XMLHttpRequest;

	// Most are inspired by jQuery
	var util = {};
	util.makeAbsolute = function (url) {
	  var div = document.createElement("div");
	  // Uses an innerHTML property to obtain an absolute URL
	  div.innerHTML = '<a href="' + url + '"/>';
	  // encodeURI and decodeURI are needed to normalize URL between IE and non-IE,
	  // since IE doesn't encode the href property value and return it - http://jsfiddle.net/Yq9M8/1/
	  return encodeURI(decodeURI(div.firstChild.href));
	};
	util.on = function (elem, type, fn) {
	  if (elem.addEventListener) {
	    elem.addEventListener(type, fn, false);
	  } else if (elem.attachEvent) {
	    elem.attachEvent("on" + type, fn);
	  }
	};
	util.stringifyURI = function (url, params) {
	  var name;
	  var s = [];
	  params = params || {};
	  params._ = guid++;
	  // params is supposed to be one-depth object
	  for (name in params) {
	    // null or undefined param value should be excluded
	    if (params[name] != null) {
	      s.push(encodeURIComponent(name) + "=" + encodeURIComponent(params[name]));
	    }
	  }
	  return url + (/\?/.test(url) ? "&" : "?") + s.join("&").replace(/%20/g, "+");
	};
	util.parseURI = function (url) {
	  // Deal with only query part
	  var obj = {
	    query: {}
	  };
	  var match = /.*\?([^#]*)/.exec(url);
	  if (match) {
	    var array = match[1].split("&");
	    for (var i = 0; i < array.length; i++) {
	      var part = array[i].split("=");
	      obj.query[decodeURIComponent(part[0])] = decodeURIComponent(part[1] || "");
	    }
	  }
	  return obj;
	};
	// CORS able
	util.corsable = "withCredentials" in new XMLHttpRequest();
	// Browser sniffing
	util.browser = function () {
	  var ua = navigator.userAgent.toLowerCase();
	  var browser = {};
	  var match =
	  // IE 9-10
	  /(msie) ([\w.]+)/.exec(ua) ||
	  // IE 11+
	  /(trident)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
	  // Safari
	  ua.indexOf("android") < 0 && /version\/(.+) (safari)/.exec(ua) || [];

	  // Swaps variables
	  if (match[2] === "safari") {
	    match[2] = match[1];
	    match[1] = "safari";
	  }
	  browser[match[1] || ""] = true;
	  browser.version = match[2] || "0";
	  browser.vmajor = browser.version.split(".")[0];
	  // Trident is the layout engine of IE
	  if (browser.trident) {
	    browser.msie = true;
	  }
	  return browser;
	}();
	util.crossOrigin = function (uri) {
	  // Origin parts
	  var parts = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/.exec(uri.toLowerCase());
	  return !!(parts && (
	  // protocol
	  parts[1] != location.protocol ||
	  // hostname
	  parts[2] != location.hostname ||
	  // port
	  (parts[3] || (parts[1] === "http:" ? 80 : 443)) != (location.port || (location.protocol === "http:" ? 80 : 443))));
	};

	// Inspired by jQuery.Callbacks
	function createCallbacks(deferred) {
	  var _locked;
	  var memory;
	  var firing;
	  var firingStart;
	  var firingLength;
	  var firingIndex;
	  var list = [];
	  var _fire = function _fire(context, args) {
	    args = args || [];
	    memory = !deferred || [context, args];
	    firing = true;
	    firingIndex = firingStart || 0;
	    firingStart = 0;
	    firingLength = list.length;
	    for (; firingIndex < firingLength && !_locked; firingIndex++) {
	      list[firingIndex].apply(context, args);
	    }
	    firing = false;
	  };
	  var self = {
	    add: function add(fn) {
	      var length = list.length;

	      list.push(fn);
	      if (firing) {
	        firingLength = list.length;
	      } else if (!_locked && memory && memory !== true) {
	        firingStart = length;
	        _fire(memory[0], memory[1]);
	      }
	    },
	    remove: function remove(fn) {
	      var i;

	      for (i = 0; i < list.length; i++) {
	        if (fn === list[i] || fn.guid && fn.guid === list[i].guid) {
	          if (firing) {
	            if (i <= firingLength) {
	              firingLength--;
	              if (i <= firingIndex) {
	                firingIndex--;
	              }
	            }
	          }
	          list.splice(i--, 1);
	        }
	      }
	    },
	    fire: function fire(context, args) {
	      if (!_locked && !firing && !(deferred && memory)) {
	        _fire(context, args);
	      }
	    },
	    lock: function lock() {
	      _locked = true;
	    },
	    locked: function locked() {
	      return !!_locked;
	    },
	    unlock: function unlock() {
	      _locked = memory = firing = firingStart = firingLength = firingIndex = undefined;
	    }
	  };

	  return self;
	}

	// Socket object
	function createSocket(uris, options) {
	  // Default socket options
	  var defaults = {
	    reconnect: function reconnect(lastDelay) {
	      return 2 * (lastDelay || 250);
	    },
	    transports: [createWebSocketTransport, createHttpStreamTransport, createHttpLongpollTransport]
	  };
	  // Overrides defaults
	  if (options) {
	    for (var i in options) {
	      defaults[i] = options[i];
	    }
	  }
	  options = defaults;

	  // Socket
	  var self = {};
	  // Events
	  var events = {};
	  // Adds event handler
	  self.on = function (type, fn) {
	    var event;
	    // For custom event
	    event = events[type];
	    if (!event) {
	      if (events.message.locked()) {
	        return this;
	      }
	      event = events[type] = createCallbacks();
	      event.order = events.message.order;
	    }
	    event.add(fn);
	    return this;
	  };
	  // Removes event handler
	  self.off = function (type, fn) {
	    var event = events[type];
	    if (event) {
	      event.remove(fn);
	    }
	    return this;
	  };
	  // Adds one time event handler
	  self.once = function (type, fn) {
	    function proxy() {
	      self.off(type, proxy);
	      fn.apply(self, arguments);
	    }

	    fn.guid = fn.guid || guid++;
	    proxy.guid = fn.guid;
	    return self.on(type, proxy);
	  };
	  // Fires event handlers
	  self.fire = function (type) {
	    var event = events[type];
	    if (event) {
	      event.fire(self, slice.call(arguments, 1));
	    }
	    return this;
	  };

	  // Networking
	  // Transport associated with this socket
	  var transport;
	  // Reconnection
	  var reconnectTimer;
	  var reconnectDelay;
	  var reconnectTry = 0;
	  // For internal use only
	  // Establishes a connection
	  self.open = function () {
	    // Resets the transport
	    transport = null;
	    // Cancels the scheduled connection
	    clearTimeout(reconnectTimer);
	    // Resets event helpers
	    events.connecting.unlock();
	    events.open.unlock();
	    // Fires the connecting event and connects to the server
	    return self.fire("connecting");
	  };
	  // Disconnects the connection
	  self.close = function () {
	    // Prevents reconnection
	    options.reconnect = false;
	    clearTimeout(reconnectTimer);
	    if (state === "connecting") {
	      // It will execute the connecting transport's stop function
	      self.fire("close");
	    } else if (state === "opened") {
	      // It will fire the close event to socket
	      transport.close();
	    }
	    return this;
	  };
	  // Id
	  var id;
	  // If the user sets this option, we should have full control of window.name
	  // It's obstructive but inevitable
	  if (options.name) {
	    if (window.name) {
	      var names = JSON.parse(window.name);
	      id = names[options.name];
	    }
	  }
	  // State
	  var state;
	  self.state = function () {
	    return state;
	  };
	  // Each event represents a possible state of this socket
	  // they are considered as special event and works in a different way
	  for (var i in {
	    connecting: 1,
	    open: 1,
	    close: 1,
	    waiting: 1
	  }) {
	    // This event fires only one time and handlers being added after fire are fired immediately
	    events[i] = createCallbacks(true);
	    // State transition order
	    events[i].order = guid++;
	  }
	  // However all the other event including message event work as you expected
	  // it fires many times and handlers are executed whenever it fires
	  events.message = createCallbacks(false);
	  // It shares the same order with the open event because it can be fired when a socket is in the
	  // opened state
	  events.message.order = events.open.order;
	  // State transition
	  self.on("connecting", function () {
	    // From null state
	    state = "connecting";
	    // Final URIs to work with transport
	    var candidates = Array.isArray(uris) ? slice.call(uris) : [uris];
	    for (var i = 0; i < candidates.length; i++) {
	      // Attaches the id to uri
	      var uri = candidates[i] = util.stringifyURI(util.makeAbsolute(candidates[i]), {
	        sid: id
	      });
	      // Translates an abbreviated uri
	      if (/^https?:/.test(uri) && !util.parseURI(uri).query.transport) {
	        candidates.splice(i, 1, uri.replace(/^http/, "ws"),
	        // util.stringifyURI is used since we don't know if uri has already query
	        util.stringifyURI(uri, {
	          transport: "stream"
	        }), util.stringifyURI(uri, {
	          transport: "longpoll"
	        }));
	        i = i + 2;
	      }
	    }
	    // Finds a working transport
	    (function find() {
	      var uri = candidates.shift();
	      // If every available transport failed
	      if (!uri) {
	        self.fire("error", new Error())
	        // Fires the close event instead of executing close method which destorys the socket
	        .fire("close");
	        return;
	      }
	      // Deremines a transport from URI through transports option
	      var testTransport;
	      for (var i = 0; i < options.transports.length; i++) {
	        testTransport = options.transports[i](uri, options);
	        if (testTransport) {
	          break;
	        }
	      }
	      // It would be null if it can't run on this environment or handle given URI
	      if (!testTransport) {
	        find();
	        return;
	      }
	      // This is to stop the whole process to find a working transport
	      // when socket's close method is called while doing that
	      function stop() {
	        testTransport.off("close", find).close();
	      }

	      self.once("close", stop);
	      testTransport.on("close", find).on("close", function () {
	        self.off("close", stop);
	      }).on("text", function handshaker(data) {
	        // handshaker is one-time event handler
	        testTransport.off("text", handshaker);
	        var headers = util.parseURI(data).query;
	        // An issued id
	        if (id !== headers.sid) {
	          id = headers.sid;
	          self.fire("new");
	        }
	        // An heartbeat option can't be set by user
	        options.heartbeat = +headers.heartbeat;
	        // To speed up heartbeat test
	        options._heartbeat = +headers._heartbeat || 5000;
	        // Now that handshaking is completed, associates the transport with the socket
	        transport = testTransport.off("close", find);

	        // Handles an inbound event object
	        function onevent(event) {
	          var latch;
	          var reply = function reply(success) {
	            return function (value) {
	              // The latch prevents double reply.
	              if (!latch) {
	                latch = true;
	                self.send("reply", {
	                  id: event.id,
	                  data: value,
	                  exception: !success
	                });
	              }
	            };
	          };
	          var args = [event.type, event.data, !event.reply ? null : {
	            resolve: reply(true),
	            reject: reply(false)
	          }];
	          self.fire.apply(self, args);
	        }

	        var skip;
	        transport.on("text", function (data) {
	          // Because this handler is executed on dispatching text event,
	          // first message for handshaking should be skipped
	          if (!skip) {
	            skip = true;
	            return;
	          }
	          onevent(JSON.parse(data));
	        }).on("binary", function (data) {
	          // In browser, data is ArrayBuffer and should be wrapped in Uint8Array
	          // In Node, data should be Buffer
	          data = new Uint8Array(data);

	          onevent(_msgpackLite2.default.decode(data));
	        }).on("error", function (error) {
	          // If the underlying connection is closed due to this error, accordingly close event
	          // will be triggered
	          self.fire("error", error);
	        }).on("close", function () {
	          self.fire("close");
	        });
	        // And fires open event to socket
	        self.off("close", stop).fire("open");
	      }).open();
	    })();
	  }).on("new", function () {
	    if (options.name) {
	      var names = window.name ? JSON.parse(window.name) : {};
	      names[options.name] = id;
	      window.name = JSON.stringify(names);
	    }
	  }).on("open", function () {
	    // From connecting state
	    state = "opened";
	    var heartbeatTimer;
	    // Sets a heartbeat timer and clears it on close event
	    (function setHeartbeatTimer() {
	      // heartbeat event will be sent after options.heartbeat - options._heartbeat ms
	      heartbeatTimer = setTimeout(function () {
	        self.send("heartbeat").once("heartbeat", function () {
	          clearTimeout(heartbeatTimer);
	          setHeartbeatTimer();
	        });
	        // transport will be closed after options._heartbeat ms unless the server responds it
	        heartbeatTimer = setTimeout(function () {
	          self.fire("error", new Error("heartbeat"));
	          // Now that the transport doesn't realize its connection is closed, execute close method
	          // It will also fire close event to transport and accordingly socket
	          transport.close();
	        }, options._heartbeat);
	      }, options.heartbeat - options._heartbeat);
	    })();
	    self.once("close", function () {
	      clearTimeout(heartbeatTimer);
	    });
	    // Locks the connecting event
	    events.connecting.lock();
	    // Initializes variables related with reconnection
	    reconnectTimer = reconnectDelay = null;
	    reconnectTry = 0;
	  }).on("close", function () {
	    // From connecting or opened state
	    state = "closed";
	    // Locks event whose order is lower than close event among reserved events
	    events.connecting.lock();
	    events.open.lock();

	    // Schedules reconnection
	    if (options.reconnect) {
	      // By adding a handler by one method in event handling
	      // it will be the last one of close event handlers having been added
	      self.once("close", function () {
	        reconnectDelay = options.reconnect.call(self, reconnectDelay, reconnectTry);
	        if (reconnectDelay !== false) {
	          reconnectTry++;
	          reconnectTimer = setTimeout(function () {
	            self.open();
	          }, reconnectDelay);
	          self.fire("waiting", reconnectDelay, reconnectTry);
	        }
	      });
	    }
	  }).on("waiting", function () {
	    // From closed state
	    state = "waiting";
	  });

	  // Messaging
	  // A map for reply callback
	  var callbacks = {};
	  // Sends an event to the server via the connection
	  self.send = function (type, data, onResolved, onRejected) {
	    if (state !== "opened") {
	      self.fire("cache", [type, data, onResolved, onRejected]);
	      return this;
	    }

	    // Outbound event
	    var event = {
	      id: guid++,
	      type: type,
	      data: data,
	      reply: !!(onResolved || onRejected)
	    };
	    if (event.reply) {
	      callbacks[event.id] = [onResolved, onRejected];
	    }

	    // Determines if the given data contains binary
	    var hasBinary = false;

	    // IE 9 doesn't support typed arrays
	    var ArrayBuffer = window.ArrayBuffer;
	    if (ArrayBuffer) {
	      JSON.stringify(data, function (key, value) {
	        hasBinary = hasBinary || ArrayBuffer.isView(value);
	        return value;
	      });
	    }

	    // Delegates to the transport
	    if (hasBinary) {
	      transport.send(_msgpackLite2.default.encode(event));
	    } else {
	      transport.send(JSON.stringify(event));
	    }
	    return this;
	  };
	  self.on("reply", function (reply) {
	    // callbacks[reply.id] is [onResolved, onRejected]
	    // FYI +false and +true is 0 and 1, respectively
	    callbacks[reply.id][+reply.exception].call(self, reply.data);
	    delete callbacks[reply.id];
	  });
	  return self.open();
	}

	function createBaseTransport(uri, options) {
	  var timeout = options && options.timeout || 3000;
	  var self = {};
	  self.open = function () {
	    // Establishes a real connection
	    self.connect();
	    // Sets a timeout timer and clear it on open or close event
	    var timeoutTimer = setTimeout(function () {
	      self.fire("error", new Error("timeout"))
	      // To abort connection
	      .close();
	    }, timeout);

	    function clearTimeoutTimer() {
	      clearTimeout(timeoutTimer);
	    }

	    self.on("open", clearTimeoutTimer).on("close", clearTimeoutTimer);
	    return this;
	  };
	  // Transport events
	  var events = {
	    open: createCallbacks(true),
	    text: createCallbacks(),
	    binary: createCallbacks(),
	    error: createCallbacks(),
	    close: createCallbacks(true)
	  };
	  self.on = function (type, fn) {
	    events[type].add(fn);
	    return this;
	  };
	  self.off = function (type, fn) {
	    events[type].remove(fn);
	    return this;
	  };
	  self.fire = function (type) {
	    events[type].fire(self, slice.call(arguments, 1));
	    return this;
	  };
	  var opened = false;
	  self.on("open", function () {
	    opened = true;
	  });
	  self.on("close", function () {
	    opened = false;
	    // Locks every event except close event
	    for (var type in events) {
	      if (type !== "close") {
	        events[type].lock();
	      }
	    }
	  });
	  self.send = function (data) {
	    if (opened) {
	      self.write(data);
	    } else {
	      self.emit("error", new Error("notopened"));
	    }
	    return this;
	  };
	  return self;
	}

	function createWebSocketTransport(uri, options) {
	  var WebSocket = window.WebSocket;
	  if (!WebSocket || !/^wss?:/.test(uri)) {
	    return;
	  }
	  var ws;
	  var self = createBaseTransport(uri, options);
	  self.connect = function () {
	    ws = new WebSocket(uri);
	    // Reads binary frame as ArrayBuffer
	    ws.binaryType = "arraybuffer";
	    ws.onopen = function () {
	      self.fire("open");
	    };
	    ws.onmessage = function (event) {
	      if (typeof event.data === "string") {
	        self.fire("text", event.data);
	      } else {
	        // event.data is ArrayBuffer in browser and Buffer in Node
	        self.fire("binary", event.data);
	      }
	    };
	    ws.onerror = function () {
	      // In some browsers, if onerror is called, onclose is not called.
	      self.fire("error", new Error()).fire("close");
	    };
	    ws.onclose = function () {
	      self.fire("close");
	    };
	  };
	  self.write = function (data) {
	    ws.send(data);
	  };
	  self.close = function () {
	    ws.close();
	    return this;
	  };
	  return self;
	}

	function createHttpBaseTransport(uri, options) {
	  var xdrURL = options && options.xdrURL;
	  var self = createBaseTransport(uri, options);
	  // Because id is set on open event
	  var sendURI;
	  self.on("open", function () {
	    sendURI = util.stringifyURI(uri, {
	      id: self.id
	    });
	  }).on("close", function () {
	    sendURI = null;
	  });
	  var sending = false;
	  var queue = [];
	  var onload = function onload() {
	    if (queue.length) {
	      send(queue.shift());
	    } else {
	      sending = false;
	    }
	  };
	  var onerror = function onerror() {
	    // Even though it fails to send a message, the connection may turn out to be opened
	    if (sendURI) {
	      // However it's likely that the connection was closed but the transport couldn't detect it
	      // Because if the connection is really alive, then sending a message shouldn't have failed
	      // To make it clear, closes the connection
	      self.fire("error", new Error()).close();
	    }
	  };
	  var send = !util.crossOrigin(uri) || util.corsable ?
	  // By XMLHttpRequest
	  function (data) {
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function () {
	      if (xhr.readyState === 4) {
	        if (xhr.status === 200) {
	          onload();
	        } else {
	          onerror();
	        }
	      }
	    };
	    xhr.open("POST", sendURI);
	    xhr.withCredentials = true;
	    // data is either a string or an ArrayBuffer
	    if (typeof data === "string") {
	      // In XMLHttpRequest of jsdom used to provide window in Node.js,
	      // request headers are case sensitive and it checks content-type header by 'Content-Type'
	      xhr.setRequestHeader("Content-Type", "text/plain; charset=UTF-8");
	      xhr.send("data=" + data);
	    } else {
	      // ArrayBuffer can be sent by only XMLHttpRequest 2
	      xhr.setRequestHeader("Content-Type", "application/octet-stream");

	      xhr.send(data);
	    }
	    return this;
	  } : window.XDomainRequest && xdrURL ?
	  // By XDomainRequest
	  function (data) {
	    // Only text/plain is supported for the request's Content-Type header from the fourth at
	    // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
	    var xdr = new window.XDomainRequest();
	    xdr.onload = onload;
	    xdr.onerror = onerror;
	    xdr.open("POST", xdrURL.call(self, sendURI));
	    xdr.send("data=" + data);
	    return this;
	  } :
	  // By HTMLFormElement
	  function (data) {
	    var iframe;
	    var textarea;
	    var form = document.createElement("form");
	    form.action = sendURI;
	    form.target = "socket-" + guid++;
	    form.method = "POST";
	    form.enctype = "text/plain";
	    form.acceptCharset = "UTF-8";
	    form.style.display = "none";
	    form.innerHTML = '<textarea name="data"></textarea><iframe name="' + form.target + '"></iframe>';
	    textarea = form.firstChild;
	    textarea.value = data;
	    iframe = form.lastChild;
	    util.on(iframe, "error", function () {
	      onerror();
	    });
	    util.on(iframe, "load", function () {
	      document.body.removeChild(form);
	      onload();
	    });
	    document.body.appendChild(form);
	    form.submit();
	    return this;
	  };
	  self.write = function (data) {
	    if (!sending) {
	      sending = true;
	      send(data);
	    } else {
	      queue.push(data);
	    }
	  };
	  // To notify server only once
	  var latch;
	  self.close = function () {
	    // Aborts the real connection
	    self.abort();
	    if (!latch) {
	      latch = true;
	      // Sends the abort request to the server
	      // this request is supposed to work even in unloading event so script tag should be used
	      var script = document.createElement("script");
	      script.async = false;
	      script.src = util.stringifyURI(uri, {
	        id: self.id,
	        when: "abort"
	      });
	      script.onload = script.onerror = function () {
	        if (script.parentNode) {
	          script.parentNode.removeChild(script);
	        }
	        // Fires the close event but it may be already fired by transport
	        self.fire("close");
	      };
	      document.head.appendChild(script);
	    }
	    return this;
	  };
	  return self;
	}

	function createHttpStreamTransport(uri, options) {
	  if (/^https?:/.test(uri) && util.parseURI(uri).query.transport === "stream") {
	    return createHttpSseTransport(uri, options) || createHttpStreamXhrTransport(uri, options) || createHttpStreamXdrTransport(uri, options) || createHttpStreamIframeTransport(uri, options);
	  }
	}

	function createHttpStreamBaseTransport(uri, options) {
	  var buffer = "";
	  var self = createHttpBaseTransport(uri, options);
	  // The detail about parsing is explained in the reference implementation
	  self.parse = function (chunk) {
	    // Strips off the left padding of the chunk that appears in the
	    // first chunk
	    chunk = chunk.replace(/^\s+/, "");
	    // The chunk should be not empty for correct parsing,
	    if (chunk) {
	      // String.prototype.split with string separator is reliable cross-browser
	      var lines = (buffer + chunk).split("\n\n");
	      for (var i = 0; i < lines.length - 1; i++) {
	        self.onmessage(lines[i].substring("data: ".length));
	      }
	      buffer = lines[lines.length - 1];
	    }
	  };
	  var handshaked;
	  self.onmessage = function (data) {
	    // The first message is handshake result
	    if (!handshaked) {
	      handshaked = true;
	      var query = util.parseURI(data).query;
	      // Assign a newly issued identifier for this transport
	      self.id = query.id;
	      self.fire("open");
	    } else {
	      var code = data.substring(0, 1);
	      data = data.substring(1);
	      switch (code) {
	        case "1":
	          self.fire("text", data);
	          break;
	        case "2":
	          // Decodes Base64 encoded string

	          // The same condition used in UMD
	          var decoded = atob(data);
	          // And converts it to ArrayBuffer
	          var array = new Uint8Array(data.length);
	          for (var i = 0; i < decoded.length; i++) {
	            array[i] = decoded.charCodeAt(i);
	          }
	          data = array.buffer;

	          self.fire("binary", data);
	          break;
	      }
	    }
	  };
	  return self;
	}

	function createHttpSseTransport(uri, options) {
	  var EventSource = window.EventSource;
	  if (!EventSource || util.crossOrigin(uri) && util.browser.safari && util.browser.vmajor < 7) {
	    return;
	  }
	  var es;
	  var self = createHttpStreamBaseTransport(uri, options);
	  self.connect = function () {
	    es = new EventSource(uri + "&when=open&sse=true", {
	      withCredentials: true
	    });
	    es.onmessage = function (event) {
	      self.onmessage(event.data);
	    };
	    es.onerror = function () {
	      es.close();
	      // There is no way to find whether there was an error or not
	      self.fire("close");
	    };
	  };
	  self.abort = function () {
	    es.close();
	  };
	  return self;
	}

	function createHttpStreamXhrTransport(uri, options) {
	  if (util.browser.msie && util.browser.vmajor < 10 || util.crossOrigin(uri) && !util.corsable) {
	    return;
	  }
	  var xhr;
	  var self = createHttpStreamBaseTransport(uri, options);
	  self.connect = function () {
	    var index;
	    xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function () {
	      if (xhr.readyState === 3 && xhr.status === 200) {
	        self.parse(!index ? xhr.responseText : xhr.responseText.substring(index));
	        index = xhr.responseText.length;
	      } else if (xhr.readyState === 4) {
	        if (xhr.status !== 200) {
	          // Here the connection is already closed
	          self.fire("error", new Error());
	        }
	        self.fire("close");
	      }
	    };
	    xhr.open("GET", uri + "&when=open");
	    xhr.withCredentials = true;
	    xhr.send();
	  };
	  self.abort = function () {
	    xhr.abort();
	  };
	  return self;
	}

	function createHttpStreamXdrTransport(uri, options) {
	  var xdrURL = options && options.xdrURL;
	  var XDomainRequest = window.XDomainRequest;
	  if (!xdrURL || !XDomainRequest) {
	    return;
	  }
	  var xdr;
	  var self = createHttpStreamBaseTransport(uri, options);
	  self.connect = function () {
	    var index;
	    xdr = new XDomainRequest();
	    xdr.onprogress = function () {
	      self.parse(!index ? xdr.responseText : xdr.responseText.substring(index));
	      index = xdr.responseText.length;
	    };
	    xdr.onerror = function () {
	      // Here the connection is already closed
	      // But onload isn't executed if onerror is executed so fires close event
	      self.fire("error", new Error()).fire("close");
	    };
	    xdr.onload = function () {
	      self.fire("close");
	    };
	    xdr.open("GET", xdrURL.call(self, uri + "&when=open"));
	    xdr.send();
	  };
	  self.abort = function () {
	    xdr.abort();
	  };
	  return self;
	}

	function createHttpStreamIframeTransport(uri, options) {
	  var ActiveXObject = window.ActiveXObject;
	  if (!ActiveXObject || util.crossOrigin(uri)) {
	    return;
	  }
	  var doc;
	  var stop;
	  var self = createHttpStreamBaseTransport(uri, options);
	  self.connect = function () {
	    function iterate(fn) {
	      var timeoutId;
	      // Though the interval is 1ms for real-time application, there is a delay between
	      // setTimeout calls For detail, see
	      // https://developer.mozilla.org/en/window.setTimeout#Minimum_delay_and_timeout_nesting
	      (function loop() {
	        timeoutId = setTimeout(function () {
	          if (fn() === false) {
	            return;
	          }
	          loop();
	        }, 1);
	      })();
	      return function () {
	        clearTimeout(timeoutId);
	      };
	    }

	    doc = new ActiveXObject("htmlfile");
	    doc.open();
	    doc.close();
	    var iframe = doc.createElement("iframe");
	    iframe.src = uri + "&when=open";
	    doc.body.appendChild(iframe);
	    var cdoc = iframe.contentDocument || iframe.contentWindow.document;
	    stop = iterate(function () {
	      // Waits the server's container ignorantly
	      if (!cdoc.firstChild) {
	        return;
	      }
	      // Response container
	      var container = cdoc.body.lastChild;
	      // Detects connection failure
	      if (!container) {
	        self.fire("error", new Error()).fire("close");
	        return false;
	      }

	      function readDirty() {
	        var clone = container.cloneNode(true);
	        // Adds a character not CR and LF to circumvent an IE bug
	        // If the contents of an element ends with one or more CR or LF, IE ignores them in the
	        // innerText property
	        clone.appendChild(cdoc.createTextNode("."));
	        // But the above idea causes \n chars to be replaced with \r\n or for some reason
	        // Restores them to its original state
	        var text = clone.innerText.replace(/\r\n/g, "\n");
	        return text.substring(0, text.length - 1);
	      }

	      self.parse(readDirty());
	      // The container is resetable so no index or length variable is needed
	      container.innerText = "";
	      stop = iterate(function () {
	        var text = readDirty();
	        if (text) {
	          container.innerText = "";
	          self.parse(text);
	        }
	        if (cdoc.readyState === "complete") {
	          self.fire("close");
	          return false;
	        }
	      });
	      return false;
	    });
	  };
	  self.abort = function () {
	    stop();
	    doc.execCommand("Stop");
	  };
	  return self;
	}

	function createHttpLongpollTransport(uri, options) {
	  if (/^https?:/.test(uri) && util.parseURI(uri).query.transport === "longpoll") {
	    return createHttpLongpollAjaxTransport(uri, options) || createHttpLongpollXdrTransport(uri, options) || createHttpLongpollJsonpTransport(uri, options);
	  }
	}

	function createHttpLongpollBaseTransport(uri, options) {
	  var self = createHttpBaseTransport(uri, options);
	  self.connect = function () {
	    self.poll(uri + "&when=open", function (data) {
	      var query = util.parseURI(data).query;
	      // Assign a newly issued identifier for this transport
	      self.id = query.id;
	      (function poll() {
	        self.poll(util.stringifyURI(uri, {
	          id: self.id,
	          when: "poll"
	        }), function (data) {
	          if (data) {
	            poll();
	            if (typeof data === "string") {
	              self.fire("text", data);
	            } else {
	              self.fire("binary", data);
	              // Practically this case only happens with XMLHttpRequest 2
	            }
	          } else {
	            self.fire("close");
	          }
	        });
	      })();
	      self.fire("open");
	    });
	  };
	  return self;
	}

	function createHttpLongpollAjaxTransport(uri, options) {
	  if (util.crossOrigin(uri) && !util.corsable) {
	    return;
	  }
	  var xhr;
	  var self = createHttpLongpollBaseTransport(uri, options);
	  self.poll = function (url, fn) {
	    xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function () {
	      switch (xhr.readyState) {
	        // HEADERS_RECEIVED
	        // To set xhr.responseType which can't be set on LOADING and DONE state
	        case 2:
	          // No need to make the header value lowercase because it is case sensitive unless there
	          // is a charset
	          if (xhr.getResponseHeader("content-type") === "application/octet-stream") {
	            // Reads response body as ArrayBuffer as it's binary
	            xhr.responseType = "arraybuffer";
	          }
	          break;
	        // DONE
	        // To avoid c00c023f error on IE 9
	        case 4:
	          if (xhr.status === 200) {
	            // xhr.response follows the type specified by xhr.responseType
	            fn(xhr.response || xhr.responseText);
	          } else {
	            // Here is the end of the connection due to error
	            self.fire("error", new Error()).fire("close");
	          }
	          break;
	      }
	    };
	    xhr.open("GET", url);
	    xhr.withCredentials = true;
	    xhr.send(null);
	  };
	  self.abort = function () {
	    xhr.abort();
	  };
	  return self;
	}

	function createHttpLongpollXdrTransport(uri, options) {
	  var xdrURL = options && options.xdrURL;
	  var XDomainRequest = window.XDomainRequest;
	  if (!xdrURL || !XDomainRequest) {
	    return;
	  }
	  var xdr;
	  var self = createHttpLongpollBaseTransport(uri, options);
	  self.poll = function (url, fn) {
	    url = xdrURL.call(self, url);
	    xdr = new XDomainRequest();
	    xdr.onload = function () {
	      fn(xdr.responseText);
	    };
	    xdr.onerror = function () {
	      // Since if onerror is called, onload is not called,
	      // fn which triggers poll request is also not called and the connection ends here
	      self.fire("error", new Error()).fire("close");
	    };
	    xdr.open("GET", url);
	    xdr.send();
	  };
	  self.abort = function () {
	    xdr.abort();
	  };
	  return self;
	}

	var jsonpCallbacks = [];
	// Only for IE 9
	function createHttpLongpollJsonpTransport(uri, options) {
	  var script;
	  var self = createHttpLongpollBaseTransport(uri, options);
	  var callback = jsonpCallbacks.pop() || "socket_" + guid++;
	  self.on("close", function () {
	    delete window[callback];
	    jsonpCallbacks.push(callback);
	  });
	  self.poll = function (url, fn) {
	    window[callback] = function (data) {
	      fn(data);
	    };
	    script = document.createElement("script");
	    script.async = true;
	    // In fact, jsonp and callback params are only for first request
	    script.src = util.stringifyURI(url, {
	      jsonp: "true",
	      callback: callback
	    });
	    script.onload = script.onerror = function (event) {
	      if (script.parentNode) {
	        script.parentNode.removeChild(script);
	      }
	      if (event.type === "error") {
	        self.fire("error", new Error()).fire("close");
	      }
	    };
	    document.head.appendChild(script);
	  };
	  self.abort = function () {
	    if (script.parentNode) {
	      script.parentNode.removeChild(script);
	    }
	  };
	  return self;
	}

	// Socket instances
	var sockets = [];
	// For browser environment
	util.on(window, "unload", function () {
	  var socket;
	  for (var i = 0; i < sockets.length; i++) {
	    socket = sockets[i];
	    // Closes a socket as the document is unloaded
	    if (socket.state() !== "closed") {
	      socket.close();
	    }
	  }
	});
	util.on(window, "online", function () {
	  var socket;
	  for (var i = 0; i < sockets.length; i++) {
	    socket = sockets[i];
	    // Opens a socket because of no reason to wait
	    if (socket.state() === "waiting") {
	      socket.open();
	    }
	  }
	});
	util.on(window, "offline", function () {
	  var socket;
	  for (var i = 0; i < sockets.length; i++) {
	    socket = sockets[i];
	    // Fires a close event immediately
	    if (socket.state() === "opened") {
	      // The underlying transport will detect disconnection and fire close event after a few
	      // seconds
	      socket.fire("error", new Error()).fire("close");
	    }
	  }
	});

	// Defines the module
	var Cettia = {
	  // Creates a socket and connects to the server
	  open: function open(uris, options) {
	    // Opens a new socket
	    var socket = createSocket(uris, options);
	    sockets.push(socket);
	    return socket;
	  },
	  // Defines the transport module
	  transport: {
	    // Creates a WebSocket transport
	    createWebSocketTransport: createWebSocketTransport,
	    // Creates a HTTP streaming transport
	    createHttpStreamTransport: createHttpStreamTransport,
	    // Creates a HTTP long polling transport
	    createHttpLongpollTransport: createHttpLongpollTransport
	  },
	  // To help debug or apply hotfix only
	  util: util
	};
	module.exports = Cettia;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// browser.js

	exports.encode = __webpack_require__(2).encode;
	exports.decode = __webpack_require__(17).decode;

	exports.Encoder = __webpack_require__(23).Encoder;
	exports.Decoder = __webpack_require__(25).Decoder;

	exports.createCodec = __webpack_require__(16).createCodec;
	exports.codec = __webpack_require__(26).codec;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// encode.js

	exports.encode = encode;

	var encode = __webpack_require__(3).encode;
	var EncodeBuffer = __webpack_require__(14).EncodeBuffer;

	function encode(input, options) {
	  var encoder = new EncodeBuffer(options);
	  encode(encoder, input);
	  return encoder.read();
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// write-core.js

	exports.encode = encode;

	var type = __webpack_require__(4).type;

	function encode(encoder, value) {
	  var func = type[typeof value];
	  if (!func) throw new Error("Unsupported type \"" + (typeof value) + "\": " + value);
	  func(encoder, value);
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// write-type.js

	exports.type = {
	  "boolean": bool,
	  "function": nil,
	  "number": number,
	  "object": object,
	  "string": string,
	  "symbol": nil,
	  "undefined": nil
	};

	var BufferLite = __webpack_require__(9);
	var token = __webpack_require__(10).token;
	var encode = __webpack_require__(3).encode;
	var uint8 = __webpack_require__(11).uint8;
	var ExtBuffer = __webpack_require__(12).ExtBuffer;

	var IS_BUFFER_SHIM = ("TYPED_ARRAY_SUPPORT" in Buffer);
	var IS_ARRAY = __webpack_require__(13);

	function bool(encoder, value) {
	  // false -- 0xc2
	  // true -- 0xc3
	  var type = value ? 0xc3 : 0xc2;
	  token[type](encoder, value);
	}

	function number(encoder, value) {
	  var ivalue = value | 0;
	  var type;
	  if (value !== ivalue) {
	    // float 64 -- 0xcb
	    type = 0xcb;
	    token[type](encoder, value);
	    return;
	  } else if (-0x20 <= ivalue && ivalue <= 0x7F) {
	    // positive fixint -- 0x00 - 0x7f
	    // negative fixint -- 0xe0 - 0xff
	    type = ivalue & 0xFF;
	  } else if (0 <= ivalue) {
	    // uint 8 -- 0xcc
	    // uint 16 -- 0xcd
	    // uint 32 -- 0xce
	    // uint 64 -- 0xcf
	    type = (ivalue <= 0xFF) ? 0xcc : (ivalue <= 0xFFFF) ? 0xcd : 0xce;
	  } else {
	    // int 8 -- 0xd0
	    // int 16 -- 0xd1
	    // int 32 -- 0xd2
	    // int 64 -- 0xd3
	    type = (-0x80 <= ivalue) ? 0xd0 : (-0x8000 <= ivalue) ? 0xd1 : 0xd2;
	  }
	  token[type](encoder, ivalue);
	}

	function string(encoder, value) {
	  // str 8 -- 0xd9
	  // str 16 -- 0xda
	  // str 32 -- 0xdb
	  // fixstr -- 0xa0 - 0xbf

	  // prepare buffer
	  var length = value.length;
	  var maxsize = 5 + length * 3;
	  encoder.reserve(maxsize);

	  // expected header size
	  var expected = (length < 32) ? 1 : (length <= 0xFF) ? 2 : (length <= 0xFFFF) ? 3 : 5;

	  // expected start point
	  var start = encoder.offset + expected;

	  // write string
	  length = BufferLite.writeString.call(encoder.buffer, value, start);

	  // actual header size
	  var actual = (length < 32) ? 1 : (length <= 0xFF) ? 2 : (length <= 0xFFFF) ? 3 : 5;

	  // move content when needed
	  if (expected !== actual) {
	    var targetStart = encoder.offset + actual;
	    var end = start + length;
	    if (IS_BUFFER_SHIM) {
	      BufferLite.copy.call(encoder.buffer, encoder.buffer, targetStart, start, end);
	    } else {
	      encoder.buffer.copy(encoder.buffer, targetStart, start, end);
	    }
	  }

	  // write header
	  var type = (actual === 1) ? (0xa0 + length) : (actual <= 3) ? 0xd7 + actual : 0xdb;
	  token[type](encoder, length);

	  // move cursor
	  encoder.offset += length;
	}

	var extmap = [];
	extmap[1] = 0xd4;
	extmap[2] = 0xd5;
	extmap[4] = 0xd6;
	extmap[8] = 0xd7;
	extmap[16] = 0xd8;

	function object(encoder, value) {
	  if (IS_ARRAY(value)) return array(encoder, value);
	  if (value === null) return nil(encoder, value);
	  if (Buffer.isBuffer(value)) return bin(encoder, value);
	  var packer = encoder.codec.getExtPacker(value);
	  if (packer) value = packer(value);
	  if (value instanceof ExtBuffer) return ext(encoder, value);
	  map(encoder, value);
	}

	function nil(encoder, value) {
	  // nil -- 0xc0
	  var type = 0xc0;
	  token[type](encoder, value);
	}

	function array(encoder, value) {
	  // fixarray -- 0x90 - 0x9f
	  // array 16 -- 0xdc
	  // array 32 -- 0xdd
	  var length = value.length;
	  var type = (length < 16) ? (0x90 + length) : (length <= 0xFFFF) ? 0xdc : 0xdd;
	  token[type](encoder, length);
	  for (var i = 0; i < length; i++) {
	    encode(encoder, value[i]);
	  }
	}

	function bin(encoder, value) {
	  // bin 8 -- 0xc4
	  // bin 16 -- 0xc5
	  // bin 32 -- 0xc6
	  var length = value.length;
	  var type = (length < 0xFF) ? 0xc4 : (length <= 0xFFFF) ? 0xc5 : 0xc6;
	  token[type](encoder, length);
	  encoder.send(value);
	}

	function ext(encoder, value) {
	  // fixext 1 -- 0xd4
	  // fixext 2 -- 0xd5
	  // fixext 4 -- 0xd6
	  // fixext 8 -- 0xd7
	  // fixext 16 -- 0xd8
	  // ext 8 -- 0xc7
	  // ext 16 -- 0xc8
	  // ext 32 -- 0xc9
	  var buffer = value.buffer;
	  var length = buffer.length;
	  var type = extmap[length] || ((length < 0xFF) ? 0xc7 : (length <= 0xFFFF) ? 0xc8 : 0xc9);
	  token[type](encoder, length);
	  uint8[value.type](encoder);
	  encoder.send(buffer);
	}

	function map(encoder, value) {
	  // fixmap -- 0x80 - 0x8f
	  // map 16 -- 0xde
	  // map 32 -- 0xdf
	  var keys = Object.keys(value);
	  var length = keys.length;
	  var type = (length < 16) ? (0x80 + length) : (length <= 0xFFFF) ? 0xde : 0xdf;
	  token[type](encoder, length);
	  keys.forEach(function(key) {
	    encode(encoder, key);
	    encode(encoder, value[key]);
	  });
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(6)
	var ieee754 = __webpack_require__(7)
	var isArray = __webpack_require__(8)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()

	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192 // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}

	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)

	  var actual = that.write(string, encoding)

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len)
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8'

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true

	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0

	  if (this === target) return 0

	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)

	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }

	  return len
	}

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0

	  if (!val) val = 0

	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }

	  return this
	}

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict'

	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray

	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}

	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63

	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}

	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}

	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)

	  arr = new Arr(len * 3 / 4 - placeHolders)

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len

	  var L = 0

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }

	  parts.push(output)

	  return parts.join('')
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	// util.js

	var MAXBUFLEN = 8192;

	exports.writeString = writeString;
	exports.readString = readString;
	exports.byteLength = byteLength;
	exports.copy = copy;
	exports.writeUint64BE = writeUint64BE;
	exports.writeInt64BE = writeInt64BE;

	// new Buffer(string, "utf-8") is SLOWER then below

	function writeString(string, start) {
	  var buffer = this;
	  var index = start || 0;
	  var length = string.length;
	  // JavaScript's string uses UTF-16 surrogate pairs for characters other than BMP.
	  // This encodes string as CESU-8 which never reaches 4 octets per character.
	  for (var i = 0; i < length; i++) {
	    var chr = string.charCodeAt(i);
	    if (chr < 0x80) {
	      buffer[index++] = chr;
	    } else if (chr < 0x800) {
	      buffer[index++] = 0xC0 | (chr >> 6);
	      buffer[index++] = 0x80 | (chr & 0x3F);
	    } else {
	      buffer[index++] = 0xE0 | (chr >> 12);
	      buffer[index++] = 0x80 | ((chr >> 6) & 0x3F);
	      buffer[index++] = 0x80 | (chr & 0x3F);
	    }
	  }
	  return index - start;
	}

	// Buffer.ptototype.toString is 2x FASTER then below
	// https://github.com/feross/buffer may throw "Maximum call stack size exceeded." at String.fromCharCode.apply.

	function readString(start, end) {
	  var buffer = this;
	  var index = start - 0 || 0;
	  if (!end) end = buffer.length;
	  var size = end - start;
	  if (size > MAXBUFLEN) size = MAXBUFLEN;
	  var out = [];
	  for (; index < end;) {
	    var array = new Array(size);
	    for (var pos = 0; pos < size && index < end;) {
	      var chr = buffer[index++];
	      chr = (chr < 0x80) ? chr :
	        (chr < 0xE0) ? (((chr & 0x3F) << 6) | (buffer[index++] & 0x3F)) :
	          (((chr & 0x3F) << 12) | ((buffer[index++] & 0x3F) << 6) | ((buffer[index++] & 0x3F)));
	      array[pos++] = chr;
	    }
	    if (pos < size) array = array.slice(0, pos);
	    out.push(String.fromCharCode.apply("", array));
	  }
	  return (out.length > 1) ? out.join("") : out.length ? out.shift() : "";
	}

	// Buffer.byteLength is FASTER than below

	function byteLength(string) {
	  var length = 0 | 0;
	  Array.prototype.forEach.call(string, function(chr) {
	    var code = chr.charCodeAt(0);
	    length += (code < 0x80) ? 1 : (code < 0x800) ? 2 : 3;
	  });
	  return length;
	}

	// https://github.com/feross/buffer lacks descending copying feature

	function copy(target, targetStart, start, end) {
	  var i;
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (!targetStart) targetStart = 0;
	  var len = end - start;

	  if (target === this && start < targetStart && targetStart < end) {
	    // descending
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    // ascending
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start];
	    }
	  }

	  return len;
	}

	function writeUint64BE(value, offset) {
	  for (var i = 7; i >= 0; i--) {
	    this[offset + i] = value & 0xFF;
	    value /= 256;
	  }
	}

	function writeInt64BE(value, offset) {
	  if (value > 0) return writeUint64BE.call(this, value, offset);
	  value++;
	  for (var i = 7; i >= 0; i--) {
	    this[offset + i] = ((-value) & 0xFF) ^ 0xFF;
	    value /= 256;
	  }
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// write-token.js

	var token = exports.token = new Array(256);

	var BufferLite = __webpack_require__(9);
	var uint8 = __webpack_require__(11).uint8;

	var NO_ASSERT = true;
	var IS_BUFFER_SHIM = ("TYPED_ARRAY_SUPPORT" in Buffer);
	var NO_TYPED_ARRAY = IS_BUFFER_SHIM && !Buffer.TYPED_ARRAY_SUPPORT;

	init();

	function init() {
	  // positive fixint -- 0x00 - 0x7f
	  // nil -- 0xc0
	  // false -- 0xc2
	  // true -- 0xc3
	  // negative fixint -- 0xe0 - 0xff
	  for (var i = 0x00; i <= 0xFF; i++) {
	    token[i] = uint8[i];
	  }

	  if (NO_TYPED_ARRAY) {
	    init_compatible(); // old browsers
	  } else {
	    init_optimized(); // Node.js and browsers with TypedArray
	  }
	}

	function init_optimized() {
	  // bin 8 -- 0xc4
	  // bin 16 -- 0xc5
	  // bin 32 -- 0xc6
	  token[0xc4] = write1(0xc4);
	  token[0xc5] = write2(0xc5);
	  token[0xc6] = write4(0xc6);

	  // ext 8 -- 0xc7
	  // ext 16 -- 0xc8
	  // ext 32 -- 0xc9
	  token[0xc7] = write1(0xc7);
	  token[0xc8] = write2(0xc8);
	  token[0xc9] = write4(0xc9);

	  // float 32 -- 0xca
	  // float 64 -- 0xcb
	  token[0xca] = writeN(0xca, 4, Buffer.prototype.writeFloatBE);
	  token[0xcb] = writeN(0xcb, 8, Buffer.prototype.writeDoubleBE);

	  // uint 8 -- 0xcc
	  // uint 16 -- 0xcd
	  // uint 32 -- 0xce
	  // uint 64 -- 0xcf
	  token[0xcc] = write1(0xcc);
	  token[0xcd] = write2(0xcd);
	  token[0xce] = write4(0xce);
	  token[0xcf] = writeN(0xcf, 8, BufferLite.writeUint64BE);

	  // int 8 -- 0xd0
	  // int 16 -- 0xd1
	  // int 32 -- 0xd2
	  // int 64 -- 0xd3
	  token[0xd0] = write1(0xd0);
	  token[0xd1] = write2(0xd1);
	  token[0xd2] = write4(0xd2);
	  token[0xd3] = writeN(0xd3, 8, BufferLite.writeUint64BE);

	  // str 8 -- 0xd9
	  // str 16 -- 0xda
	  // str 32 -- 0xdb
	  token[0xd9] = write1(0xd9);
	  token[0xda] = write2(0xda);
	  token[0xdb] = write4(0xdb);

	  // array 16 -- 0xdc
	  // array 32 -- 0xdd
	  token[0xdc] = write2(0xdc);
	  token[0xdd] = write4(0xdd);

	  // map 16 -- 0xde
	  // map 32 -- 0xdf
	  token[0xde] = write2(0xde);
	  token[0xdf] = write4(0xdf);
	}

	function init_compatible() {
	  // bin 8 -- 0xc4
	  // bin 16 -- 0xc5
	  // bin 32 -- 0xc6
	  token[0xc4] = writeN(0xc4, 1, Buffer.prototype.writeUInt8);
	  token[0xc5] = writeN(0xc5, 2, Buffer.prototype.writeUInt16BE);
	  token[0xc6] = writeN(0xc6, 4, Buffer.prototype.writeUInt32BE);

	  // ext 8 -- 0xc7
	  // ext 16 -- 0xc8
	  // ext 32 -- 0xc9
	  token[0xc7] = writeN(0xc7, 1, Buffer.prototype.writeUInt8);
	  token[0xc8] = writeN(0xc8, 2, Buffer.prototype.writeUInt16BE);
	  token[0xc9] = writeN(0xc9, 4, Buffer.prototype.writeUInt32BE);

	  // float 32 -- 0xca
	  // float 64 -- 0xcb
	  token[0xca] = writeN(0xca, 4, Buffer.prototype.writeFloatBE);
	  token[0xcb] = writeN(0xcb, 8, Buffer.prototype.writeDoubleBE);

	  // uint 8 -- 0xcc
	  // uint 16 -- 0xcd
	  // uint 32 -- 0xce
	  // uint 64 -- 0xcf
	  token[0xcc] = writeN(0xcc, 1, Buffer.prototype.writeUInt8);
	  token[0xcd] = writeN(0xcd, 2, Buffer.prototype.writeUInt16BE);
	  token[0xce] = writeN(0xce, 4, Buffer.prototype.writeUInt32BE);
	  token[0xcf] = writeN(0xcf, 8, BufferLite.writeUint64BE);

	  // int 8 -- 0xd0
	  // int 16 -- 0xd1
	  // int 32 -- 0xd2
	  // int 64 -- 0xd3
	  token[0xd0] = writeN(0xd0, 1, Buffer.prototype.writeInt8);
	  token[0xd1] = writeN(0xd1, 2, Buffer.prototype.writeInt16BE);
	  token[0xd2] = writeN(0xd2, 4, Buffer.prototype.writeInt32BE);
	  token[0xd3] = writeN(0xd3, 8, BufferLite.writeUint64BE);

	  // str 8 -- 0xd9
	  // str 16 -- 0xda
	  // str 32 -- 0xdb
	  token[0xd9] = writeN(0xd9, 1, Buffer.prototype.writeUInt8);
	  token[0xda] = writeN(0xda, 2, Buffer.prototype.writeUInt16BE);
	  token[0xdb] = writeN(0xdb, 4, Buffer.prototype.writeUInt32BE);

	  // array 16 -- 0xdc
	  // array 32 -- 0xdd
	  token[0xdc] = writeN(0xdc, 2, Buffer.prototype.writeUInt16BE);
	  token[0xdd] = writeN(0xdd, 4, Buffer.prototype.writeUInt32BE);

	  // map 16 -- 0xde
	  // map 32 -- 0xdf
	  token[0xde] = writeN(0xde, 2, Buffer.prototype.writeUInt16BE);
	  token[0xdf] = writeN(0xdf, 4, Buffer.prototype.writeUInt32BE);
	}

	function write1(type) {
	  return function(encoder, value) {
	    encoder.reserve(2);
	    var buffer = encoder.buffer;
	    var offset = encoder.offset;
	    buffer[offset++] = type;
	    buffer[offset++] = value;
	    encoder.offset = offset;
	  };
	}

	function write2(type) {
	  return function(encoder, value) {
	    encoder.reserve(3);
	    var buffer = encoder.buffer;
	    var offset = encoder.offset;
	    buffer[offset++] = type;
	    buffer[offset++] = value >>> 8;
	    buffer[offset++] = value;
	    encoder.offset = offset;
	  };
	}

	function write4(type) {
	  return function(encoder, value) {
	    encoder.reserve(5);
	    var buffer = encoder.buffer;
	    var offset = encoder.offset;
	    buffer[offset++] = type;
	    buffer[offset++] = value >>> 24;
	    buffer[offset++] = value >>> 16;
	    buffer[offset++] = value >>> 8;
	    buffer[offset++] = value;
	    encoder.offset = offset;
	  };
	}

	function writeN(type, len, method) {
	  return function(encoder, value) {
	    encoder.reserve(len + 1);
	    encoder.buffer[encoder.offset++] = type;
	    method.call(encoder.buffer, value, encoder.offset, NO_ASSERT);
	    encoder.offset += len;
	  };
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 11 */
/***/ function(module, exports) {

	// write-unit8.js

	var constant = exports.uint8 = new Array(256);

	for (var i = 0x00; i <= 0xFF; i++) {
	  constant[i] = write0(i);
	}

	function write0(type) {
	  return function(encoder) {
	    encoder.reserve(1);
	    encoder.buffer[encoder.offset++] = type;
	  };
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	// ext-buffer.js

	exports.ExtBuffer = ExtBuffer;

	function ExtBuffer(buffer, type) {
	  if (!(this instanceof ExtBuffer)) return new ExtBuffer(buffer, type);
	  this.buffer = buffer;
	  this.type = type;
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (array) {
	  return "[object Array]" === Object.prototype.toString.call(array);
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// encode-buffer.js

	exports.EncodeBuffer = EncodeBuffer;

	var preset = __webpack_require__(15).preset;
	var MIN_BUFFER_SIZE = 2048;
	var MAX_BUFFER_SIZE = 65536;
	var DEFAULT_OPTIONS = {};

	function EncodeBuffer(options) {
	  if (!(this instanceof EncodeBuffer)) return new EncodeBuffer(options);
	  this.options = options || DEFAULT_OPTIONS;
	  this.codec = this.options.codec || preset;
	}

	EncodeBuffer.prototype.push = function(chunk) {
	  var buffers = this.buffers || (this.buffers = []);
	  buffers.push(chunk);
	};

	EncodeBuffer.prototype.read = function() {
	  this.flush();
	  var buffers = this.buffers;
	  if (!buffers) return;
	  var chunk = buffers.length > 1 ? Buffer.concat(buffers) : buffers[0];
	  buffers.length = 0;
	  return chunk;
	};

	EncodeBuffer.prototype.flush = function() {
	  if (this.start < this.offset) {
	    this.push(this.buffer.slice(this.start, this.offset));
	    this.start = this.offset;
	  }
	};

	EncodeBuffer.prototype.reserve = function(length) {
	  if (!this.buffer) return this.alloc(length);

	  var size = this.buffer.length;

	  // is it long enough?
	  if (this.offset + length < size) return;

	  // flush current buffer
	  if (this.offset) this.flush();

	  // resize it to 2x current length
	  this.alloc(Math.max(length, Math.min(size * 2, MAX_BUFFER_SIZE)));
	};

	EncodeBuffer.prototype.alloc = function(length) {
	  // allocate new buffer
	  this.buffer = new Buffer(length > MIN_BUFFER_SIZE ? length : MIN_BUFFER_SIZE);
	  this.start = 0;
	  this.offset = 0;
	};

	EncodeBuffer.prototype.send = function(buffer) {
	  var end = this.offset + buffer.length;
	  if (this.buffer && end < this.buffer.length) {
	    buffer.copy(this.buffer, this.offset);
	    this.offset = end;
	  } else {
	    this.flush();
	    this.push(buffer);
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// ext-preset.js

	var Ext = __webpack_require__(16).Ext;

	var preset = exports.preset = new Ext();

	var encode = __webpack_require__(2).encode;
	var decode = __webpack_require__(17).decode;

	var ERROR_COLUMNS = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};

	init();

	function init() {
	  preset.addExtPacker(0x0E, Error, [packError, encode]);
	  preset.addExtPacker(0x01, EvalError, [packError, encode]);
	  preset.addExtPacker(0x02, RangeError, [packError, encode]);
	  preset.addExtPacker(0x03, ReferenceError, [packError, encode]);
	  preset.addExtPacker(0x04, SyntaxError, [packError, encode]);
	  preset.addExtPacker(0x05, TypeError, [packError, encode]);
	  preset.addExtPacker(0x06, URIError, [packError, encode]);

	  preset.addExtUnpacker(0x0E, [decode, unpackError(Error)]);
	  preset.addExtUnpacker(0x01, [decode, unpackError(EvalError)]);
	  preset.addExtUnpacker(0x02, [decode, unpackError(RangeError)]);
	  preset.addExtUnpacker(0x03, [decode, unpackError(ReferenceError)]);
	  preset.addExtUnpacker(0x04, [decode, unpackError(SyntaxError)]);
	  preset.addExtUnpacker(0x05, [decode, unpackError(TypeError)]);
	  preset.addExtUnpacker(0x06, [decode, unpackError(URIError)]);

	  preset.addExtPacker(0x0A, RegExp, [packRegExp, encode]);
	  preset.addExtPacker(0x0B, Boolean, [packValueOf, encode]);
	  preset.addExtPacker(0x0C, String, [packValueOf, encode]);
	  preset.addExtPacker(0x0D, Date, [Number, encode]);
	  preset.addExtPacker(0x0F, Number, [packValueOf, encode]);

	  preset.addExtUnpacker(0x0A, [decode, unpackRegExp]);
	  preset.addExtUnpacker(0x0B, [decode, unpackClass(Boolean)]);
	  preset.addExtUnpacker(0x0C, [decode, unpackClass(String)]);
	  preset.addExtUnpacker(0x0D, [decode, unpackClass(Date)]);
	  preset.addExtUnpacker(0x0F, [decode, unpackClass(Number)]);

	  if ("undefined" !== typeof Uint8Array) {
	    preset.addExtPacker(0x11, Int8Array, packBuffer);
	    preset.addExtPacker(0x12, Uint8Array, packBuffer);
	    preset.addExtPacker(0x13, Int16Array, packTypedArray);
	    preset.addExtPacker(0x14, Uint16Array, packTypedArray);
	    preset.addExtPacker(0x15, Int32Array, packTypedArray);
	    preset.addExtPacker(0x16, Uint32Array, packTypedArray);
	    preset.addExtPacker(0x17, Float32Array, packTypedArray);

	    preset.addExtUnpacker(0x11, unpackClass(Int8Array));
	    preset.addExtUnpacker(0x12, unpackClass(Uint8Array));
	    preset.addExtUnpacker(0x13, [unpackArrayBuffer, unpackClass(Int16Array)]);
	    preset.addExtUnpacker(0x14, [unpackArrayBuffer, unpackClass(Uint16Array)]);
	    preset.addExtUnpacker(0x15, [unpackArrayBuffer, unpackClass(Int32Array)]);
	    preset.addExtUnpacker(0x16, [unpackArrayBuffer, unpackClass(Uint32Array)]);
	    preset.addExtUnpacker(0x17, [unpackArrayBuffer, unpackClass(Float32Array)]);

	    if ("undefined" !== typeof Float64Array) {
	      // PhantomJS/1.9.7 doesn't have Float64Array
	      preset.addExtPacker(0x18, Float64Array, packTypedArray);
	      preset.addExtUnpacker(0x18, [unpackArrayBuffer, unpackClass(Float64Array)]);
	    }

	    if ("undefined" !== typeof Uint8ClampedArray) {
	      // IE10 doesn't have Uint8ClampedArray
	      preset.addExtPacker(0x19, Uint8ClampedArray, packBuffer);
	      preset.addExtUnpacker(0x19, unpackClass(Uint8ClampedArray));
	    }

	    preset.addExtPacker(0x1A, ArrayBuffer, packArrayBuffer);
	    preset.addExtPacker(0x1D, DataView, packTypedArray);
	    preset.addExtUnpacker(0x1A, unpackArrayBuffer);
	    preset.addExtUnpacker(0x1D, [unpackArrayBuffer, unpackClass(DataView)]);
	  }
	}

	function packBuffer(value) {
	  return new Buffer(value);
	}

	function packValueOf(value) {
	  return (value).valueOf();
	}

	function packRegExp(value) {
	  value = RegExp.prototype.toString.call(value).split("/");
	  value.shift();
	  var out = [value.pop()];
	  out.unshift(value.join("/"));
	  return out;
	}

	function unpackRegExp(value) {
	  return RegExp.apply(null, value);
	}

	function packError(value) {
	  var out = {};
	  for (var key in ERROR_COLUMNS) {
	    out[key] = value[key];
	  }
	  return out;
	}

	function unpackError(Class) {
	  return function(value) {
	    var out = new Class();
	    for (var key in ERROR_COLUMNS) {
	      out[key] = value[key];
	    }
	    return out;
	  };
	}

	function unpackClass(Class) {
	  return function(value) {
	    return new Class(value);
	  };
	}

	function packTypedArray(value) {
	  return new Buffer(new Uint8Array(value.buffer));
	}

	function packArrayBuffer(value) {
	  return new Buffer(new Uint8Array(value));
	}

	function unpackArrayBuffer(value) {
	  return (new Uint8Array(value)).buffer;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// ext-codec.js

	exports.Ext = Ext;
	exports.createCodec = createCodec;

	var ExtBuffer = __webpack_require__(12).ExtBuffer;
	var IS_ARRAY = __webpack_require__(13);

	function Ext() {
	  if (!(this instanceof Ext)) return new Ext();
	  this.extPackers = {};
	  this.extUnpackers = [];
	}

	function createCodec() {
	  return new Ext();
	}

	Ext.prototype.addExtPacker = function(etype, Class, packer) {
	  if (IS_ARRAY(packer)) {
	    packer = join(packer);
	  }
	  var name = Class.name;
	  if (name && name !== "Object") {
	    this.extPackers[name] = extPacker;
	  } else {
	    var list = this.extEncoderList || (this.extEncoderList = []);
	    list.unshift([Class, extPacker]);
	  }

	  function extPacker(value) {
	    var buffer = packer(value);
	    return new ExtBuffer(buffer, etype);
	  }
	};

	Ext.prototype.addExtUnpacker = function(etype, unpacker) {
	  this.extUnpackers[etype] = IS_ARRAY(unpacker) ? join(unpacker) : unpacker;
	};

	Ext.prototype.getExtPacker = function(value) {
	  var c = value.constructor;
	  var e = c && c.name && this.extPackers[c.name];
	  if (e) return e;
	  var list = this.extEncoderList;
	  if (!list) return;
	  var len = list.length;
	  for (var i = 0; i < len; i++) {
	    var pair = list[i];
	    if (c === pair[0]) return pair[1];
	  }
	};

	Ext.prototype.getExtUnpacker = function(type) {
	  return this.extUnpackers[type] || extUnpacker;

	  function extUnpacker(buffer) {
	    return new ExtBuffer(buffer, type);
	  }
	};

	function join(filters) {
	  filters = filters.slice();

	  return function(value) {
	    return filters.reduce(iterator, value);
	  };

	  function iterator(value, filter) {
	    return filter(value);
	  }
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// decode.js

	exports.decode = decode;

	var DecodeBuffer = __webpack_require__(18).DecodeBuffer;
	var decode = __webpack_require__(19).decode;

	function decode(input, options) {
	  var decoder = new DecodeBuffer(options);
	  decoder.append(input);
	  return decode(decoder);
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// decode-buffer.js

	exports.DecodeBuffer = DecodeBuffer;

	var preset = __webpack_require__(15).preset;
	var DEFAULT_OPTIONS = {};

	function DecodeBuffer(options) {
	  if (!(this instanceof DecodeBuffer)) return new DecodeBuffer(options);
	  this.options = options || DEFAULT_OPTIONS;
	  this.codec = this.options.codec || preset;
	}

	DecodeBuffer.prototype.push = Array.prototype.push;
	DecodeBuffer.prototype.read = Array.prototype.shift;

	DecodeBuffer.prototype.append = function(chunk) {
	  var prev = this.offset ? this.buffer.slice(this.offset) : this.buffer;
	  this.buffer = prev ? Buffer.concat([prev, chunk]) : chunk;
	  this.offset = 0;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// read-core.js

	exports.decode = decode;
	exports.decodeAsync = decodeAsync;

	var uint8 = __webpack_require__(20).format.uint8;
	var token = __webpack_require__(22).token;
	var BUFFER_SHORTAGE = __webpack_require__(21).BUFFER_SHORTAGE;

	function decode(decoder) {
	  var type = uint8(decoder);
	  var func = token[type];
	  if (!func) throw new Error("Invalid type: " + (type ? ("0x" + type.toString(16)) : type));
	  return func(decoder);
	}

	function decodeAsync(decoder) {
	  while (decoder.offset < decoder.buffer.length) {
	    var start = decoder.offset;
	    var value;
	    try {
	      value = decode(decoder);
	    } catch (e) {
	      if (e !== BUFFER_SHORTAGE) throw e;
	      // rollback
	      decoder.offset = start;
	      break;
	    }
	    decoder.push(value);
	  }
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// read-format.js

	exports.format = {
	  map: map,
	  array: array,
	  str: str,
	  bin: bin,
	  ext: ext,
	  uint8: uint8,
	  uint16: uint16,
	  uint32: read(4, Buffer.prototype.readUInt32BE),
	  uint64: read(8, readUInt64BE),
	  int8: read(1, Buffer.prototype.readInt8),
	  int16: read(2, Buffer.prototype.readInt16BE),
	  int32: read(4, Buffer.prototype.readInt32BE),
	  int64: read(8, readInt64BE),
	  float32: read(4, readFloatBE),
	  float64: read(8, readDoubleBE)
	};

	var ieee754 = __webpack_require__(7);

	var BufferLite = __webpack_require__(9);
	var decode = __webpack_require__(19).decode;
	var BUFFER_SHORTAGE = __webpack_require__(21).BUFFER_SHORTAGE;
	var readInt32BE = Buffer.prototype.readInt32BE;
	var readUInt32BE = Buffer.prototype.readUInt32BE;

	var IS_BUFFER_SHIM = ("TYPED_ARRAY_SUPPORT" in Buffer);
	var NO_ASSERT = true;

	function map(decoder, len) {
	  var value = {};
	  var i;
	  var k = new Array(len);
	  var v = new Array(len);
	  for (i = 0; i < len; i++) {
	    k[i] = decode(decoder);
	    v[i] = decode(decoder);
	  }
	  for (i = 0; i < len; i++) {
	    value[k[i]] = v[i];
	  }
	  return value;
	}

	function array(decoder, len) {
	  var value = new Array(len);
	  for (var i = 0; i < len; i++) {
	    value[i] = decode(decoder);
	  }
	  return value;
	}

	function str(decoder, len) {
	  var start = decoder.offset;
	  var end = decoder.offset = start + len;
	  var buffer = decoder.buffer;
	  if (end > buffer.length) throw BUFFER_SHORTAGE;
	  if (IS_BUFFER_SHIM || !Buffer.isBuffer(buffer)) {
	    // slower (compat)
	    return BufferLite.readString.call(buffer, start, end);
	  } else {
	    // 2x faster
	    return buffer.toString("utf-8", start, end);
	  }
	}

	function bin(decoder, len) {
	  var start = decoder.offset;
	  var end = decoder.offset = start + len;
	  if (end > decoder.buffer.length) throw BUFFER_SHORTAGE;
	  return slice.call(decoder.buffer, start, end);
	}

	function ext(decoder, len) {
	  var start = decoder.offset;
	  var end = decoder.offset = start + len + 1;
	  if (end > decoder.buffer.length) throw BUFFER_SHORTAGE;
	  var type = decoder.buffer[start];
	  var unpack = decoder.codec.getExtUnpacker(type);
	  if (!unpack) throw new Error("Invalid ext type: " + (type ? ("0x" + type.toString(16)) : type));
	  var buf = slice.call(decoder.buffer, start + 1, end);
	  return unpack(buf);
	}

	function uint8(decoder) {
	  var buffer = decoder.buffer;
	  if (decoder.offset >= buffer.length) throw BUFFER_SHORTAGE;
	  return buffer[decoder.offset++];
	}

	function uint16(decoder) {
	  var buffer = decoder.buffer;
	  if (decoder.offset + 2 > buffer.length) throw BUFFER_SHORTAGE;
	  return (buffer[decoder.offset++] << 8) | buffer[decoder.offset++];
	}

	function read(len, method) {
	  return function(decoder) {
	    var start = decoder.offset;
	    var end = decoder.offset = start + len;
	    if (end > decoder.buffer.length) throw BUFFER_SHORTAGE;
	    return method.call(decoder.buffer, start, NO_ASSERT);
	  };
	}

	function readUInt64BE(start, noAssert) {
	  var upper = readUInt32BE.call(this, start, noAssert);
	  var lower = readUInt32BE.call(this, start + 4, noAssert);
	  return upper ? (upper * 4294967296 + lower) : lower;
	}

	function readInt64BE(start, noAssert) {
	  var upper = readInt32BE.call(this, start, noAssert);
	  var lower = readUInt32BE.call(this, start + 4, noAssert);
	  return upper ? (upper * 4294967296 + lower) : lower;
	}

	function readFloatBE(start) {
	  if (this.readFloatBE) return this.readFloatBE(start);
	  return ieee754.read(this, start, false, 23, 4);
	}

	function readDoubleBE(start) {
	  if (this.readDoubleBE) return this.readDoubleBE(start);
	  return ieee754.read(this, start, false, 52, 8);
	}

	function slice(start, end) {
	  var f = this.slice || Array.prototype.slice;
	  var buf = f.call(this, start, end);
	  if (!Buffer.isBuffer(buf)) buf = Buffer(buf);
	  return buf;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).Buffer))

/***/ },
/* 21 */
/***/ function(module, exports) {

	// constant.js

	exports.BUFFER_SHORTAGE = new Error("BUFFER_SHORTAGE");


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// read-token.js

	var token = exports.token = new Array(256);

	var format = __webpack_require__(20).format;

	init();

	function init() {
	  var i;

	  // positive fixint -- 0x00 - 0x7f
	  for (i = 0x00; i <= 0x7f; i++) {
	    token[i] = constant(i);
	  }

	  // fixmap -- 0x80 - 0x8f
	  for (i = 0x80; i <= 0x8f; i++) {
	    token[i] = fix(i - 0x80, format.map);
	  }

	  // fixarray -- 0x90 - 0x9f
	  for (i = 0x90; i <= 0x9f; i++) {
	    token[i] = fix(i - 0x90, format.array);
	  }

	  // fixstr -- 0xa0 - 0xbf
	  for (i = 0xa0; i <= 0xbf; i++) {
	    token[i] = fix(i - 0xa0, format.str);
	  }

	  // nil -- 0xc0
	  token[0xc0] = constant(null);

	  // (never used) -- 0xc1
	  token[0xc1] = null;

	  // false -- 0xc2
	  // true -- 0xc3
	  token[0xc2] = constant(false);
	  token[0xc3] = constant(true);

	  // bin 8 -- 0xc4
	  // bin 16 -- 0xc5
	  // bin 32 -- 0xc6
	  token[0xc4] = flex(format.uint8, format.bin);
	  token[0xc5] = flex(format.uint16, format.bin);
	  token[0xc6] = flex(format.uint32, format.bin);

	  // ext 8 -- 0xc7
	  // ext 16 -- 0xc8
	  // ext 32 -- 0xc9
	  token[0xc7] = flex(format.uint8, format.ext);
	  token[0xc8] = flex(format.uint16, format.ext);
	  token[0xc9] = flex(format.uint32, format.ext);

	  // float 32 -- 0xca
	  // float 64 -- 0xcb
	  token[0xca] = format.float32;
	  token[0xcb] = format.float64;

	  // uint 8 -- 0xcc
	  // uint 16 -- 0xcd
	  // uint 32 -- 0xce
	  // uint 64 -- 0xcf
	  token[0xcc] = format.uint8;
	  token[0xcd] = format.uint16;
	  token[0xce] = format.uint32;
	  token[0xcf] = format.uint64;

	  // int 8 -- 0xd0
	  // int 16 -- 0xd1
	  // int 32 -- 0xd2
	  // int 64 -- 0xd3
	  token[0xd0] = format.int8;
	  token[0xd1] = format.int16;
	  token[0xd2] = format.int32;
	  token[0xd3] = format.int64;

	  // fixext 1 -- 0xd4
	  // fixext 2 -- 0xd5
	  // fixext 4 -- 0xd6
	  // fixext 8 -- 0xd7
	  // fixext 16 -- 0xd8
	  token[0xd4] = fix(1, format.ext);
	  token[0xd5] = fix(2, format.ext);
	  token[0xd6] = fix(4, format.ext);
	  token[0xd7] = fix(8, format.ext);
	  token[0xd8] = fix(16, format.ext);

	  // str 8 -- 0xd9
	  // str 16 -- 0xda
	  // str 32 -- 0xdb
	  token[0xd9] = flex(format.uint8, format.str);
	  token[0xda] = flex(format.uint16, format.str);
	  token[0xdb] = flex(format.uint32, format.str);

	  // array 16 -- 0xdc
	  // array 32 -- 0xdd
	  token[0xdc] = flex(format.uint16, format.array);
	  token[0xdd] = flex(format.uint32, format.array);

	  // map 16 -- 0xde
	  // map 32 -- 0xdf
	  token[0xde] = flex(format.uint16, format.map);
	  token[0xdf] = flex(format.uint32, format.map);

	  // negative fixint -- 0xe0 - 0xff
	  for (i = 0xe0; i <= 0xff; i++) {
	    token[i] = constant(i - 0x100);
	  }
	}

	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	function flex(lenFunc, decodeFunc) {
	  return function(decoder) {
	    var len = lenFunc(decoder);
	    return decodeFunc(decoder, len);
	  };
	}

	function fix(len, method) {
	  return function(decoder) {
	    return method(decoder, len);
	  };
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// encoder.js

	exports.Encoder = Encoder;

	var EventLite = __webpack_require__(24);
	var encode = __webpack_require__(3).encode;
	var EncodeBuffer = __webpack_require__(14).EncodeBuffer;

	function Encoder(options) {
	  if (!(this instanceof Encoder)) return new Encoder(options);
	  EncodeBuffer.call(this, options);
	}

	Encoder.prototype = new EncodeBuffer();

	EventLite.mixin(Encoder.prototype);

	Encoder.prototype.encode = function(chunk) {
	  encode(this, chunk);
	  this.emit("data", this.read());
	};

	Encoder.prototype.end = function(chunk) {
	  if (arguments.length) this.encode(chunk);
	  this.flush();
	  this.emit("end");
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
	 *
	 * @copyright Yusuke Kawasaki
	 * @license MIT
	 * @constructor
	 * @see https://github.com/kawanet/event-lite
	 * @see http://kawanet.github.io/event-lite/EventLite.html
	 * @example
	 * var EventLite = require("event-lite");
	 *
	 * function MyClass() {...}             // your class
	 *
	 * EventLite.mixin(MyClass.prototype);  // import event methods
	 *
	 * var obj = new MyClass();
	 * obj.on("foo", function() {...});     // add event listener
	 * obj.once("bar", function() {...});   // add one-time event listener
	 * obj.emit("foo");                     // dispatch event
	 * obj.emit("bar");                     // dispatch another event
	 * obj.off("foo");                      // remove event listener
	 */

	function EventLite() {
	  if (!(this instanceof EventLite)) return new EventLite();
	}

	(function(EventLite) {
	  // export the class for node.js
	  if (true) module.exports = EventLite;

	  // property name to hold listeners
	  var LISTENERS = "listeners";

	  // methods to export
	  var methods = {
	    on: on,
	    once: once,
	    off: off,
	    emit: emit
	  };

	  // mixin to self
	  mixin(EventLite.prototype);

	  // export mixin function
	  EventLite.mixin = mixin;

	  /**
	   * Import on(), once(), off() and emit() methods into target object.
	   *
	   * @function EventLite.mixin
	   * @param target {Prototype}
	   */

	  function mixin(target) {
	    for (var key in methods) {
	      target[key] = methods[key];
	    }
	    return target;
	  }

	  /**
	   * Add an event listener.
	   *
	   * @function EventLite.prototype.on
	   * @param type {string}
	   * @param func {Function}
	   * @returns {EventLite} Self for method chaining
	   */

	  function on(type, func) {
	    getListeners(this, type).push(func);
	    return this;
	  }

	  /**
	   * Add one-time event listener.
	   *
	   * @function EventLite.prototype.once
	   * @param type {string}
	   * @param func {Function}
	   * @returns {EventLite} Self for method chaining
	   */

	  function once(type, func) {
	    var that = this;
	    wrap.originalListener = func;
	    getListeners(that, type).push(wrap);
	    return that;

	    function wrap() {
	      off.call(that, type, wrap);
	      func.apply(this, arguments);
	    }
	  }

	  /**
	   * Remove an event listener.
	   *
	   * @function EventLite.prototype.off
	   * @param [type] {string}
	   * @param [func] {Function}
	   * @returns {EventLite} Self for method chaining
	   */

	  function off(type, func) {
	    var that = this;
	    var listners;
	    if (!arguments.length) {
	      delete that[LISTENERS];
	    } else if (!func) {
	      listners = that[LISTENERS];
	      if (listners) {
	        delete listners[type];
	        if (!Object.keys(listners).length) return off.call(that);
	      }
	    } else {
	      listners = getListeners(that, type, true);
	      if (listners) {
	        listners = listners.filter(ne);
	        if (!listners.length) return off.call(that, type);
	        that[LISTENERS][type] = listners;
	      }
	    }
	    return that;

	    function ne(test) {
	      return test !== func && test.originalListener !== func;
	    }
	  }

	  /**
	   * Dispatch (trigger) an event.
	   *
	   * @function EventLite.prototype.emit
	   * @param type {string}
	   * @param [value] {*}
	   * @returns {boolean} True when a listener received the event
	   */

	  function emit(type, value) {
	    var that = this;
	    var listeners = getListeners(that, type, true);
	    if (!listeners) return false;
	    var arglen = arguments.length;
	    if (arglen === 1) {
	      listeners.forEach(zeroarg);
	    } else if (arglen === 2) {
	      listeners.forEach(onearg);
	    } else {
	      var args = Array.prototype.slice.call(arguments, 1);
	      listeners.forEach(moreargs);
	    }
	    return !!listeners.length;

	    function zeroarg(func) {
	      func.call(that);
	    }

	    function onearg(func) {
	      func.call(that, value);
	    }

	    function moreargs(func) {
	      func.apply(that, args);
	    }
	  }

	  /**
	   * @ignore
	   */

	  function getListeners(that, type, readonly) {
	    if (readonly && !that[LISTENERS]) return;
	    var listeners = that[LISTENERS] || (that[LISTENERS] = {});
	    return listeners[type] || (listeners[type] = []);
	  }

	})(EventLite);


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// decoder.js

	exports.Decoder = Decoder;

	var EventLite = __webpack_require__(24);
	var DecodeBuffer = __webpack_require__(18).DecodeBuffer;
	var decodeAsync = __webpack_require__(19).decodeAsync;

	function Decoder(options) {
	  if (!(this instanceof Decoder)) return new Decoder(options);
	  DecodeBuffer.call(this, options);
	}

	Decoder.prototype = new DecodeBuffer();

	EventLite.mixin(Decoder.prototype);

	Decoder.prototype.decode = function(chunk) {
	  if (chunk) this.append(chunk);
	  decodeAsync(this);
	};

	Decoder.prototype.push = function(chunk) {
	  this.emit("data", chunk);
	};

	Decoder.prototype.end = function(chunk) {
	  this.decode(chunk);
	  this.emit("end");
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports.codec = {
		preset: __webpack_require__(15).preset
	};


/***/ },
/* 27 */
/***/ function(module, exports) {

	var traverse = module.exports = function (obj) {
	    return new Traverse(obj);
	};

	function Traverse (obj) {
	    this.value = obj;
	}

	Traverse.prototype.get = function (ps) {
	    var node = this.value;
	    for (var i = 0; i < ps.length; i ++) {
	        var key = ps[i];
	        if (!node || !hasOwnProperty.call(node, key)) {
	            node = undefined;
	            break;
	        }
	        node = node[key];
	    }
	    return node;
	};

	Traverse.prototype.has = function (ps) {
	    var node = this.value;
	    for (var i = 0; i < ps.length; i ++) {
	        var key = ps[i];
	        if (!node || !hasOwnProperty.call(node, key)) {
	            return false;
	        }
	        node = node[key];
	    }
	    return true;
	};

	Traverse.prototype.set = function (ps, value) {
	    var node = this.value;
	    for (var i = 0; i < ps.length - 1; i ++) {
	        var key = ps[i];
	        if (!hasOwnProperty.call(node, key)) node[key] = {};
	        node = node[key];
	    }
	    node[ps[i]] = value;
	    return value;
	};

	Traverse.prototype.map = function (cb) {
	    return walk(this.value, cb, true);
	};

	Traverse.prototype.forEach = function (cb) {
	    this.value = walk(this.value, cb, false);
	    return this.value;
	};

	Traverse.prototype.reduce = function (cb, init) {
	    var skip = arguments.length === 1;
	    var acc = skip ? this.value : init;
	    this.forEach(function (x) {
	        if (!this.isRoot || !skip) {
	            acc = cb.call(this, acc, x);
	        }
	    });
	    return acc;
	};

	Traverse.prototype.paths = function () {
	    var acc = [];
	    this.forEach(function (x) {
	        acc.push(this.path); 
	    });
	    return acc;
	};

	Traverse.prototype.nodes = function () {
	    var acc = [];
	    this.forEach(function (x) {
	        acc.push(this.node);
	    });
	    return acc;
	};

	Traverse.prototype.clone = function () {
	    var parents = [], nodes = [];
	    
	    return (function clone (src) {
	        for (var i = 0; i < parents.length; i++) {
	            if (parents[i] === src) {
	                return nodes[i];
	            }
	        }
	        
	        if (typeof src === 'object' && src !== null) {
	            var dst = copy(src);
	            
	            parents.push(src);
	            nodes.push(dst);
	            
	            forEach(objectKeys(src), function (key) {
	                dst[key] = clone(src[key]);
	            });
	            
	            parents.pop();
	            nodes.pop();
	            return dst;
	        }
	        else {
	            return src;
	        }
	    })(this.value);
	};

	function walk (root, cb, immutable) {
	    var path = [];
	    var parents = [];
	    var alive = true;
	    
	    return (function walker (node_) {
	        var node = immutable ? copy(node_) : node_;
	        var modifiers = {};
	        
	        var keepGoing = true;
	        
	        var state = {
	            node : node,
	            node_ : node_,
	            path : [].concat(path),
	            parent : parents[parents.length - 1],
	            parents : parents,
	            key : path.slice(-1)[0],
	            isRoot : path.length === 0,
	            level : path.length,
	            circular : null,
	            update : function (x, stopHere) {
	                if (!state.isRoot) {
	                    state.parent.node[state.key] = x;
	                }
	                state.node = x;
	                if (stopHere) keepGoing = false;
	            },
	            'delete' : function (stopHere) {
	                delete state.parent.node[state.key];
	                if (stopHere) keepGoing = false;
	            },
	            remove : function (stopHere) {
	                if (isArray(state.parent.node)) {
	                    state.parent.node.splice(state.key, 1);
	                }
	                else {
	                    delete state.parent.node[state.key];
	                }
	                if (stopHere) keepGoing = false;
	            },
	            keys : null,
	            before : function (f) { modifiers.before = f },
	            after : function (f) { modifiers.after = f },
	            pre : function (f) { modifiers.pre = f },
	            post : function (f) { modifiers.post = f },
	            stop : function () { alive = false },
	            block : function () { keepGoing = false }
	        };
	        
	        if (!alive) return state;
	        
	        function updateState() {
	            if (typeof state.node === 'object' && state.node !== null) {
	                if (!state.keys || state.node_ !== state.node) {
	                    state.keys = objectKeys(state.node)
	                }
	                
	                state.isLeaf = state.keys.length == 0;
	                
	                for (var i = 0; i < parents.length; i++) {
	                    if (parents[i].node_ === node_) {
	                        state.circular = parents[i];
	                        break;
	                    }
	                }
	            }
	            else {
	                state.isLeaf = true;
	                state.keys = null;
	            }
	            
	            state.notLeaf = !state.isLeaf;
	            state.notRoot = !state.isRoot;
	        }
	        
	        updateState();
	        
	        // use return values to update if defined
	        var ret = cb.call(state, state.node);
	        if (ret !== undefined && state.update) state.update(ret);
	        
	        if (modifiers.before) modifiers.before.call(state, state.node);
	        
	        if (!keepGoing) return state;
	        
	        if (typeof state.node == 'object'
	        && state.node !== null && !state.circular) {
	            parents.push(state);
	            
	            updateState();
	            
	            forEach(state.keys, function (key, i) {
	                path.push(key);
	                
	                if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
	                
	                var child = walker(state.node[key]);
	                if (immutable && hasOwnProperty.call(state.node, key)) {
	                    state.node[key] = child.node;
	                }
	                
	                child.isLast = i == state.keys.length - 1;
	                child.isFirst = i == 0;
	                
	                if (modifiers.post) modifiers.post.call(state, child);
	                
	                path.pop();
	            });
	            parents.pop();
	        }
	        
	        if (modifiers.after) modifiers.after.call(state, state.node);
	        
	        return state;
	    })(root).node;
	}

	function copy (src) {
	    if (typeof src === 'object' && src !== null) {
	        var dst;
	        
	        if (isArray(src)) {
	            dst = [];
	        }
	        else if (isDate(src)) {
	            dst = new Date(src.getTime ? src.getTime() : src);
	        }
	        else if (isRegExp(src)) {
	            dst = new RegExp(src);
	        }
	        else if (isError(src)) {
	            dst = { message: src.message };
	        }
	        else if (isBoolean(src)) {
	            dst = new Boolean(src);
	        }
	        else if (isNumber(src)) {
	            dst = new Number(src);
	        }
	        else if (isString(src)) {
	            dst = new String(src);
	        }
	        else if (Object.create && Object.getPrototypeOf) {
	            dst = Object.create(Object.getPrototypeOf(src));
	        }
	        else if (src.constructor === Object) {
	            dst = {};
	        }
	        else {
	            var proto =
	                (src.constructor && src.constructor.prototype)
	                || src.__proto__
	                || {}
	            ;
	            var T = function () {};
	            T.prototype = proto;
	            dst = new T;
	        }
	        
	        forEach(objectKeys(src), function (key) {
	            dst[key] = src[key];
	        });
	        return dst;
	    }
	    else return src;
	}

	var objectKeys = Object.keys || function keys (obj) {
	    var res = [];
	    for (var key in obj) res.push(key)
	    return res;
	};

	function toS (obj) { return Object.prototype.toString.call(obj) }
	function isDate (obj) { return toS(obj) === '[object Date]' }
	function isRegExp (obj) { return toS(obj) === '[object RegExp]' }
	function isError (obj) { return toS(obj) === '[object Error]' }
	function isBoolean (obj) { return toS(obj) === '[object Boolean]' }
	function isNumber (obj) { return toS(obj) === '[object Number]' }
	function isString (obj) { return toS(obj) === '[object String]' }

	var isArray = Array.isArray || function isArray (xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	};

	var forEach = function (xs, fn) {
	    if (xs.forEach) return xs.forEach(fn)
	    else for (var i = 0; i < xs.length; i++) {
	        fn(xs[i], i, xs);
	    }
	};

	forEach(objectKeys(Traverse.prototype), function (key) {
	    traverse[key] = function (obj) {
	        var args = [].slice.call(arguments, 1);
	        var t = new Traverse(obj);
	        return t[key].apply(t, args);
	    };
	});

	var hasOwnProperty = Object.hasOwnProperty || function (obj, key) {
	    return key in obj;
	};


/***/ }
/******/ ]);
