var cettia = require("../cettia");
var should = require("chai").should();

describe('reconnection', function () {
  test("websocket", "ws://somewhere");
  test("httpstream", "http://somewhere?cettia-transport-name=stream");
  test("httplongpoll", "http://somewhere?cettia-transport-name=longpoll");

  function test(transportName, uri) {
    it(transportName, function (done) {
      var state = "";
      var tries = 0;
      var socket = cettia.open(uri);

      socket.on("connecting", function () {
        state += socket.state();
      });
      socket.on("open", function () {
        true.should.be.false;
      });
      socket.on("close", function () {
        state += socket.state();
      });
      socket.on("waiting", function (delay, attempts) {
        state += socket.state();
        state.should.be.equal(["connecting", "closed", "waiting"].join(""));
        state = "";
        tries++;

        switch (tries) {
          case 1:
            delay.should.be.equal(500);
            attempts.should.be.equal(1);
            break;
          case 2:
            delay.should.be.equal(1000);
            attempts.should.be.equal(2);
            break;
          case 3:
            delay.should.be.equal(2000);
            attempts.should.be.equal(3);
            done();
            break;
        }
      });
    });
  }
});
