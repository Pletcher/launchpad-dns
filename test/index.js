var Hapi = require('hapi');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Lab.expect;

describe('index', function() {
  it('registers the plugin', function(done) {
    var server = new Hapi.Server();

    var baseOptions = {
      method: 'POST',
      url: '/github'
    };

    server.pack.register({
      plugin: require('../'),
      options: {
        token: 'zanzibar',
        uri: 'api.github.com'
      }
    }, function(err) {
      expect(err).to.equal(undefined);
    });

    expect(server.methods.dns).to.exist;

    done();
  });
});
