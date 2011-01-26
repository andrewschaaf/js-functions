(function() {
  var BUFFERS, assert, pack, pack_min, ref_pack, ref_unpack, testPacker, testUnpacker, unpack, unpack_min;
  assert = require('assert');
  ref_unpack = require('msgpack').unpack;
  ref_pack = require('msgpack').pack;
  BUFFERS = require('./msgpack_test_buffers');
  pack = require('./../../src/msgpack_pack').f;
  pack_min = require('./../msgpack_pack.min').f;
  unpack = require('./../../src/msgpack_unpack').f;
  unpack_min = require('./../msgpack_unpack.min').f;
  testPacker = function(packer) {
    var buf, _i, _len, _pack, _results;
    _pack = function(x) {
      var octets;
      octets = [];
      packer(x, octets);
      return new Buffer(octets);
    };
    _results = [];
    for (_i = 0, _len = BUFFERS.length; _i < _len; _i++) {
      buf = BUFFERS[_i];
      _results.push(assert.eql(ref_unpack(_pack(ref_unpack(buf))), ref_unpack(ref_pack(ref_unpack(buf)))));
    }
    return _results;
  };
  testUnpacker = function(unpacker) {
    var buf, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = BUFFERS.length; _i < _len; _i++) {
      buf = BUFFERS[_i];
      _results.push(assert.eql(unpacker(buf, {
        i: 0
      }), ref_unpack(buf)));
    }
    return _results;
  };
  module.exports = {
    pack: function() {
      return testPacker(pack);
    },
    pack_min: function() {
      return testPacker(pack_min);
    },
    unpack: function() {
      return testUnpacker(unpack);
    },
    unpack_min: function() {
      return testUnpacker(unpack_min);
    }
  };
}).call(this);
