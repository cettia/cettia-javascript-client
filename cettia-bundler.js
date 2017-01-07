var _msgpackLite = require('msgpack-lite');

var _msgpackLite2 = _interopRequireDefault(_msgpackLite);

var _traverse = require('traverse');

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
