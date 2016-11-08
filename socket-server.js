// Cettia part
var cettia = require("cettia-protocol");
var server = cettia.createServer();
// When a socket is created as the beginning of the lifecycle
server.on("socket", function(socket) {
  console.log("on server's socket");

  // Lifecycle events
  // When the handshake is performed successfully
  socket.on("open", function() {
    console.log("on open");
  });
  // When the underlying transport is closed for some reason
  socket.on("close", function() {
    console.log("on close"); 
  });
  // When an error happens on the socket
  socket.on("error", function(error) {
    console.log("on error", error);
  });
  // When the socket has been closed for a long time i.e. 1 minute and deleted from the server as the end of the lifecycle
  socket.on("delete", function() {
    console.log("on delete");
  });

  // echo and chat events
  socket.on("echo", function(data) {
    console.log("on echo", data);
    socket.send("echo", data);
  });
  socket.on("chat", function(data) {
    console.log("on chat", data);
    server.sockets.forEach(function(socket) {
      socket.send("chat", data);
    });
  });
});
var httpTransportServer = cettia.transport.createHttpServer().on("transport", server.handle);
var wsTransportServer = cettia.transport.createWebSocketServer().on("transport", server.handle);

// Node.js part
var url = require("url");
var http = require("http");
var httpServer = http.createServer();
httpServer.on("request", function(req, res) {
  if (url.parse(req.url).pathname === "/cettia") {
    httpTransportServer.handle(req, res);
  }
});
httpServer.on("upgrade", function(req, sock, head) {
  if (url.parse(req.url).pathname === "/cettia") {
    wsTransportServer.handle(req, sock, head);
  }
});
httpServer.listen(8080);
