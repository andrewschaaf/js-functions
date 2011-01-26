
assert = require 'assert'

enc = require('./../../src/base64_encode').f
enc_min = require('./../base64_encode.min').f
dec = require('./../../src/base64_decode').f
dec_min = require('./../base64_decode.min').f


BUFFERS = [
  new Buffer []
  new Buffer [0]
  new Buffer [0, 0]
  new Buffer [0, 0, 0]
  new Buffer [0, 0, 0, 0]
  new Buffer [0, 0, 0, 0, 0]
  new Buffer [0, 0, 0, 0, 0, 0]
  new Buffer [0, 0, 0, 0, 0, 0, 0]
  new Buffer [0, 0, 0, 0, 0, 0, 0, 0]
  new Buffer [1]
  new Buffer [1, 1]
  new Buffer [1, 1, 1]
  new Buffer [1, 1, 1, 1]
  new Buffer [1, 1, 1, 1, 1]
  new Buffer [1, 1, 1, 1, 1, 1]
  new Buffer [1, 1, 1, 1, 1, 1, 1]
  new Buffer [1, 1, 1, 1, 1, 1, 1, 1]
]


testEncoder = (f) ->
  for buf in BUFFERS
    assert.eql f(buf), buf.toString('base64')


testDecoder = (f) ->
  for buf in BUFFERS
    b64 = buf.toString 'base64'
    x = new Buffer(f(b64)).toString('base64')
    assert.eql x, b64


module.exports =
  
  encode: () -> testEncoder enc
  encode_min: () -> testEncoder enc_min
  decode: () -> testDecoder dec
  decode_min: () -> testDecoder dec_min


