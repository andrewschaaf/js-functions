/*
    00-7F       non-negative fixnum
    80-8F       fix dict
    90-9F       fix list
    A0-BF       fix data
    C0          null
    C2          false
    C3          true
    CA          float
    CB          double
    C{C,D,E,F}  {1,2,4,8}-byte uint
    D{0,1,2,3}  {1,2,4,8}-byte int
    D4-D9       ...free?...
    DA-DB       data
    DC-DD       list
    DE-DF       dict
    E0-FF       negative fixnum
    
    pack: [0-9]+ dict keys are converted to integers
    unpack: integer dict keys are coverted to strings
*/

(function() {
  
  exports['f'] = function(x, arr) {
    var pushNonneg = function(
                          n,
                          fixnumBound, fixnumFrom,
                          multibyteFrom,
                          ifMultibyteMustBeAtLeast2Bytes) {
      
      ifMultibyteMustBeAtLeast2Bytes = ifMultibyteMustBeAtLeast2Bytes || 0;
      
      ((n < fixnumBound) ?
        // fixnum
        (arr.push(fixnumFrom + n)) :
        (((n < 0x100) && (! ifMultibyteMustBeAtLeast2Bytes)) ?
          // 1-byte
          (arr.push(multibyteFrom, n)) :
          ((n < 0x10000) ?
            // 2-byte
            (arr.push(multibyteFrom + 1 - ifMultibyteMustBeAtLeast2Bytes, n >> 8, n & 0xFF)) :
            ((n < 0x100000000) ?
              // 4-byte
              (arr.push(multibyteFrom + 2 - ifMultibyteMustBeAtLeast2Bytes,
                        n >>> 24,
                        (n >> 16) & 0xFF,
                        (n >> 8) & 0xFF,
                        n & 0xFF)):
              (0)))));
    };
    
    var tmp, len;
    var typeChar = (typeof x).charAt(0);
    var floor = Math.floor;
    var i = 0;
    
    if (x == null) {
      arr.push(0xC0);
    }
    else if (typeChar == 'b') {
      arr.push(x ? 0xC3 : 0xC2);
    }
    else if (typeChar == 's') {
      var utf8 = unescape(encodeURIComponent(x));
      len = utf8.length;
      pushNonneg(len, 32, 0xA0, 0xDA, 1);
      for (; i < len; i++) {
        arr.push(utf8.charCodeAt(i));
      }
    }
    else if (typeChar == 'n') {
      if (isNaN(x) || !isFinite(x)) {
        // TODO error
      }
      else {
        if (x % 1) {
          // TODO double
        }
        else {
          ((x < 0) ?
            // negative
            ((x > -33) ?
              // fixnum, -1 --> FF
              (arr.push(x + 256)) :
              ((x > -129) ?
                // 1-byte, -33 --> DF
                (arr.push(0xD0, x + 256)) :
                ((x > -32769) ?
                  // 2-byte, -129 --> FF7F
                  (pushNonneg(x + 0x10000, 0, 0, 0xD0)) :
                  ((x > -2147483649) ?
                    // 4-byte
                    (pushNonneg(x + 0x100000000, 0, 0, 0xD0)) :
                    (0))))) :
            // non-negative
            (pushNonneg(x, 128, 0x00, 0xCC)))
        }
      }
    }
    else {
      if (x instanceof Array) {
        tmp = x;
        pushNonneg(tmp.length, 16, 0x90, 0xDC, 1);
      }
      else {
        tmp = [];
        for (k in x) {
          if (x.hasOwnProperty(k)) {
            tmp.push((k.match(/^[0-9]+$/) ? parseInt(k, 10) : k));
            tmp.push(x[k]);
          }
        }
        pushNonneg(tmp.length / 2, 16, 0x80, 0xDE, 1);
      }
      for (len = tmp.length; i < len; i++) {
        arguments.callee(tmp[i], arr);
      }
    }
  };
})();
