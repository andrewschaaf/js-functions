(function() {
  var BUFFERS, assert, dec, dec_min, enc, enc_min, testDecoder, testEncoder;
  assert = require('assert');
  enc = require('./../../src/base64_encode').f;
  enc_min = require('./../base64_encode.min').f;
  dec = require('./../../src/base64_decode').f;
  dec_min = require('./../base64_decode.min').f;
  BUFFERS = [new Buffer([]), new Buffer([0]), new Buffer([0, 0]), new Buffer([0, 0, 0]), new Buffer([0, 0, 0, 0]), new Buffer([0, 0, 0, 0, 0]), new Buffer([0, 0, 0, 0, 0, 0]), new Buffer([0, 0, 0, 0, 0, 0, 0]), new Buffer([0, 0, 0, 0, 0, 0, 0, 0]), new Buffer([1]), new Buffer([1, 1]), new Buffer([1, 1, 1]), new Buffer([1, 1, 1, 1]), new Buffer([1, 1, 1, 1, 1]), new Buffer([1, 1, 1, 1, 1, 1]), new Buffer([1, 1, 1, 1, 1, 1, 1]), new Buffer([1, 1, 1, 1, 1, 1, 1, 1])];
  testEncoder = function(f) {
    var buf, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = BUFFERS.length; _i < _len; _i++) {
      buf = BUFFERS[_i];
      _results.push(assert.eql(f(buf), buf.toString('base64')));
    }
    return _results;
  };
  testDecoder = function(f) {
    var b64, buf, x, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = BUFFERS.length; _i < _len; _i++) {
      buf = BUFFERS[_i];
      b64 = buf.toString('base64');
      x = new Buffer(f(b64)).toString('base64');
      _results.push(assert.eql(x, b64));
    }
    return _results;
  };
  module.exports = {
    encode: function() {
      return testEncoder(enc);
    },
    encode_min: function() {
      return testEncoder(enc_min);
    },
    decode: function() {
      return testDecoder(dec);
    },
    decode_min: function() {
      return testDecoder(dec_min);
    }
  };
}).call(this);
