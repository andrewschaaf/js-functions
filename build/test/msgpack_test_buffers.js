(function() {
  MIN_INT;  var BUFFERS, MAX_INT, MAX_SIZE, MIN_INT, NUMBERS_OF_INTEREST, arr, d, i, j, kindaBuf, point, realBuffers, ref_pack, size, sizeOfInterest, strings, x, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _m, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
  ref_pack = require('msgpack').pack;
  BUFFERS = [ref_pack(null), ref_pack(false), ref_pack(true)];
  MAX_SIZE = (256 * 256 * 256 * 256) - 1;
  MIN_INT = -((256 * 256 * 256 * 256) / 2);
  MAX_INT = (256 * 256 * 256 * 256) - 1;
  _ref = [0, 16, 1 << 16];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    sizeOfInterest = _ref[_i];
    for (i = _ref2 = -3; (_ref2 <= 3 ? i < 3 : i > 3); (_ref2 <= 3 ? i += 1 : i -= 1)) {
      size = sizeOfInterest + i;
      if ((0 <= size && size <= MAX_SIZE)) {
        arr = [];
        for (j = 0; (0 <= size ? j < size : j > size); (0 <= size ? j += 1 : j -= 1)) {
          arr.push('.');
        }
        BUFFERS.push(ref_pack(arr.join('')));
      }
    }
  }
  strings = [];
  for (i = 1; i < 10000; i++) {
    strings.push(String.fromCharCode(i));
  }
  BUFFERS.push(new Buffer(strings.join(''), 'utf-8'));
  _ref3 = [0, 16, 1 << 16];
  for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
    sizeOfInterest = _ref3[_j];
    for (i = _ref4 = -3; (_ref4 <= 3 ? i < 3 : i > 3); (_ref4 <= 3 ? i += 1 : i -= 1)) {
      size = sizeOfInterest + i;
      if ((0 <= size && size <= MAX_SIZE)) {
        arr = [];
        for (j = 0; (0 <= size ? j < size : j > size); (0 <= size ? j += 1 : j -= 1)) {
          arr.push(1);
        }
        BUFFERS.push(ref_pack(arr));
      }
    }
  }
  _ref5 = [0, 16, 1 << 16];
  for (_k = 0, _len3 = _ref5.length; _k < _len3; _k++) {
    sizeOfInterest = _ref5[_k];
    for (i = _ref6 = -3; (_ref6 <= 3 ? i < 3 : i > 3); (_ref6 <= 3 ? i += 1 : i -= 1)) {
      size = sizeOfInterest + i;
      if ((0 <= size && size <= MAX_SIZE)) {
        d = {};
        for (j = 0; (0 <= size ? j < size : j > size); (0 <= size ? j += 1 : j -= 1)) {
          d['' + j] = j;
        }
        BUFFERS.push(ref_pack(d));
      }
    }
  }
  d = {
    '-1000': -1000,
    '5': 5
  };
  BUFFERS.push(ref_pack(d));
  NUMBERS_OF_INTEREST = [-(256 * 256 * 256 * 256 * 2), -(256 * 256 * 256 * 256), -((256 * 256 * 256 * 256) / 2), -(1 << 16), -(1 << 15), -1000, -128, -32, 0, 1000, 1 << 7, 1 << 8, 1 << 16, 256 * 256 * 256 * 256];
  for (_l = 0, _len4 = NUMBERS_OF_INTEREST.length; _l < _len4; _l++) {
    point = NUMBERS_OF_INTEREST[_l];
    for (i = _ref7 = -10; (_ref7 <= 10 ? i < 10 : i > 10); (_ref7 <= 10 ? i += 1 : i -= 1)) {
      x = point + i;
      if ((MIN_INT <= x && x <= MAX_INT)) {
        BUFFERS.push(ref_pack(x));
      }
    }
  }
  realBuffers = [];
  for (_m = 0, _len5 = BUFFERS.length; _m < _len5; _m++) {
    kindaBuf = BUFFERS[_m];
    realBuffers.push(new Buffer(kindaBuf.toString('base64'), 'base64'));
  }
  module.exports = realBuffers;
}).call(this);
