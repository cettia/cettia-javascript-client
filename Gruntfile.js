var domain = require("domain");
var http = require("http");
var Mocha = require("mocha");
var url = require("url");
var cettia = require("./cettia").default;

http.globalAgent.maxSockets = Infinity;

module.exports = function(grunt) {
  grunt.registerTask("test-node", function() {
    var done = this.async();
    // Thanks to https://github.com/gregrperkins/grunt-mocha-hack
    var uncaughtExceptionHandlers = process.listeners("uncaughtException");
    process.removeAllListeners("uncaughtException");
    http.createServer(function(req, res) {
      var urlObj = url.parse(req.url, true);
      var query = urlObj.query;
      switch (urlObj.pathname) {
        // Executed by the test runner
        case "/open":
          res.end();
          cettia.open(query.uri, {reconnect: false})
          .on("abort", function() {
            this.close();
          })
          .on("echo", function(data) {
            this.send("echo", data);
          })
          .on("/reply/inbound", function(data, reply) {
            switch (data.type) {
              case "resolved":
                reply.resolve(data.data);
                break;
              case "rejected":
                reply.reject(data.data);
                break;
            }
          })
          .on("/reply/outbound", function(data) {
            switch (data.type) {
              case "resolved":
                this.send("test", data.data, function(data) {
                  this.send("done", data);
                });
                break;
              case "rejected":
                this.send("test", data.data, null, function(data) {
                  this.send("done", data);
                });
                break;
            }
          });
          break;
        default:
          res.statusCode = 404;
          res.end();
          break;
      }
    })
    .on("close", function() {
      uncaughtExceptionHandlers.forEach(process.on.bind(process, "uncaughtException"));
    })
    .listen(9000, function() {
      var server = this;
      var mocha = new Mocha();
      delete require.cache[require.resolve("./node_modules/cettia-protocol/test/client.js")];
      mocha.addFile("./node_modules/cettia-protocol/test/client.js");
      // Set options through process.argv
      process.argv.push("--cettia.transports", "websocket,httpstream,httplongpoll");
      mocha.loadFiles();
      // Undo the changes
      process.argv.splice(process.argv.indexOf("--cettia.transports"), 2);
      var runDomain = domain.create();
      runDomain.run(function() {
        var runner = mocha.run(function(failures) {
          server.close(function() {
            done(failures === 0);
          });
        });
        runDomain.on("error", runner.uncaught.bind(runner));
      });
    });
  });
  grunt.registerTask("test", ["test-node"]);
};
