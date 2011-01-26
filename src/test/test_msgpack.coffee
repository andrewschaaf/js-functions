
assert = require 'assert'

ref_unpack = require('msgpack').unpack
ref_pack = require('msgpack').pack

BUFFERS = require('./msgpack_test_buffers')

pack = require('./../../src/msgpack_pack').f
pack_min = require('./../msgpack_pack.min').f
unpack = require('./../../src/msgpack_unpack').f
unpack_min = require('./../msgpack_unpack.min').f


testPacker = (packer) ->
  _pack = (x) ->
      octets = []
      packer x, octets
      new Buffer octets
  for buf in BUFFERS
      assert.eql(
        ref_unpack(_pack(ref_unpack(buf))),
        ref_unpack(ref_pack(ref_unpack(buf))))


testUnpacker = (unpacker) ->
  for buf in BUFFERS
    assert.eql unpacker(buf, {i:0}), ref_unpack(buf)


module.exports = 
  
  pack: () -> testPacker pack
  pack_min: () -> testPacker pack_min
  unpack: () -> testUnpacker unpack
  unpack_min: () -> testUnpacker unpack_min


