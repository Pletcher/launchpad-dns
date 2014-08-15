var Hapi = require('hapi');
var Lab = require('lab');
var Nipple = require('nipple');
var Sinon = require('sinon');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.beforeEach;
var after = lab.afterEach;
var expect = Lab.expect;

describe('dns()', function() {
  var requestSpy;
  var readSpy;

  before(function(done) {
    requestSpy = Sinon.stub(Nipple, 'request', function(method, uri, options, callback) {
      if (uri.indexOf('error') > -1) {
        return callback(new Error('Nipple.request() error'));
      } else if (uri.indexOf('trouble') > -1) {
        return callback(null, 'read fail');
      }

      callback(null, 'all clear');
    });

    readSpy = Sinon.stub(Nipple, 'read', function(response, options, callback) {
      if (response.indexOf('read fail') > -1) {
        return callback(new Error('Nipple.read() error'));
      }

      callback(null, {});
    });

    done();
  });

  after(function(done) {
    Nipple.request.restore();
    Nipple.read.restore();

    requestSpy = null;
    readSpy = null;

    done();
  });

  it('makes a call to add a CNAME record to DNSimple', function(done) {
    var Dns = require('../lib/dns');
    var dns = Dns({ uri: 'hello', token: 'world' });

    dns('slug', 'slug-asm', function(err, body) {
      expect(err).not.to.exist;
      expect(body).to.eql({});
      expect(requestSpy.calledOnce).to.be.true;
      expect(readSpy.calledOnce).to.be.true;

      done();
    });
  });

  it('handles request errors', function(done) {
    var Dns = require('../lib/dns');
    var dns = Dns({ uri: 'error', token: 'world' });

    dns('slug', 'slug-asm', function(err, body) {
      expect(err).to.exist;
      expect(err.message).to.equal('Nipple.request() error');
      expect(requestSpy.calledOnce).to.be.true;
      expect(readSpy.called).to.be.false;

      done();
    });
  });

  it('handles request errors', function(done) {
    var Dns = require('../lib/dns');
    var dns = Dns({ uri: 'trouble', token: 'world' });

    dns('slug', 'slug-asm', function(err, body) {
      expect(err).to.exist;
      expect(err.message).to.equal('Nipple.read() error');
      expect(requestSpy.calledOnce).to.be.true;
      expect(readSpy.calledOnce).to.be.true;

      done();
    });
  });
});
