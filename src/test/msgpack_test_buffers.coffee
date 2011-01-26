MIN_INT
ref_pack = require('msgpack').pack

BUFFERS = [
  ref_pack null
  ref_pack false
  ref_pack true
]


MAX_SIZE = (256 * 256 * 256 * 256) - 1
MIN_INT = -((256 * 256 * 256 * 256) / 2) #[0xD2, 0x80, 0x00, 0x00, 0x00]
MAX_INT = (256 * 256 * 256 * 256) - 1

#### Strings

# sizes
for sizeOfInterest in [0, 16, (1 << 16)]
  for i in [-3...3]
    size = sizeOfInterest + i
    if 0 <= size <= MAX_SIZE
      arr = []
      for j in [0...size]
        arr.push '.'
      BUFFERS.push ref_pack arr.join('')

# unicode safety
strings = []
for i in [1...10000]
   strings.push String.fromCharCode i
BUFFERS.push new Buffer strings.join(''), 'utf-8'


#### Lists

# sizes
for sizeOfInterest in [0, 16, (1 << 16)]
  for i in [-3...3]
    size = sizeOfInterest + i
    if 0 <= size <= MAX_SIZE
      arr = []
      for j in [0...size]
        arr.push 1
      BUFFERS.push ref_pack arr


#### Dicts

# sizes
for sizeOfInterest in [0, 16, (1 << 16)]
  for i in [-3...3]
    size = sizeOfInterest + i
    if 0 <= size <= MAX_SIZE
      d = {}
      for j in [0...size]
        d['' + j] = j
      BUFFERS.push ref_pack d


# [0-9]+ keys
d = {
  '-1000': -1000,
  '5': 5,
}
BUFFERS.push ref_pack d


#### Integers

NUMBERS_OF_INTEREST = [
  -(256 * 256 * 256 * 256 * 2)
  -(256 * 256 * 256 * 256)
  -((256 * 256 * 256 * 256) / 2)
  -(1 << 16)
  -(1 << 15)
  -1000
  -128
  -32
  0
  1000
  (1 << 7)
  (1 << 8)
  (1 << 16)
  (256 * 256 * 256 * 256)
]
for point in NUMBERS_OF_INTEREST
  for i in [-10...10]
    x = point + i
    if MIN_INT <= x <= MAX_INT
      BUFFERS.push ref_pack x


realBuffers = []
for kindaBuf in BUFFERS
  realBuffers.push new Buffer(kindaBuf.toString('base64'), 'base64')
module.exports = realBuffers

