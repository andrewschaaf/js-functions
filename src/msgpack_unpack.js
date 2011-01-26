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
  exports['f'] = function(octets, i_holder, err) {
    
    var arguments_callee = arguments.callee;
    
    var pos = i_holder.i || 0;
    var size, type, tmp, tmp2, i = 0;
    var o1 = octets[pos];
    i_holder.i = (pos += 1);
    
    var readUint = function(numBytes) {
      //    0
      //   01
      // 0123
      x = octets[pos + numBytes - 1];
      if (numBytes > 1) {
        x += (octets[pos + numBytes - 2] << 8);
        if (numBytes > 2) {
          x += (octets[pos + 1] << 16) + (octets[pos] * (256 * 256 * 256));
        }
      }
      
      return x;
    }
    
    // fixnums
    if (o1 < 0x80) {return o1;}
    if (o1 >= 0xE0) {return o1 - 0x100;}
    
    if (o1 > (0xC0 - 1)) {
      if (o1 < 0xDA) {
        if (o1 < 0xCC) {
          if (o1 == 0xC0) {return null;}
          if (o1 == 0xC2) {return false;}
          if (o1 == 0xC3) {return true;}
          type = -1;
        }
        else {
          // Then it must be an integer
          //  C{C,D,E,F}  {1,2,4,8}-byte uint
          //  D{0,1,2,3}  {1,2,4,8}-byte int
          //  nneg  neg
          //  1100  0000
          //  1101  0001
          //  1110  0010
          //  1111  0011
          tmp = 1 << (o1 & 3);
          if (tmp < 8) {
            // So it's a {1,2,4}-byte {u,s}int
            i_holder.i += tmp;
            return readUint(tmp) - ((o1 & 4) ?
                                      (0) :
                                      ([
                                          0,
                                          256,
                                          256 * 256,
                                          0,
                                          256 * 256 * 256 * 256
                                        ][tmp]));
          }
          // Eeek! An 8-byte {u,s}int!
          type = -1;
        }
      }
      else {
        // DA-DB   data
        // DC-DD   list
        // DE-DF   dict
        // 1111 F  1101 D  1011 B
        // 1110 E  1100 C  1010 A
        // 0110 6
        tmp = 1 << ((o1 & 1) + 1) // only 2 or 4 bytes
        size = readUint(tmp);
        pos += tmp;
        
        tmp = o1 & 6;
        type = ((tmp == (0xDA & 6)) ?
                  (0xA0) :
                  ((tmp == (0xDC & 6)) ?
                    (0x90) :
                    (0x80)));
      }
    }
    else {
      
      // fix{map,array}
      if (o1 < 0xA0) {
        type = o1 & 0xF0;
        size = o1 - type;
      }
      
      // fixdata
      else {
        type = 0xA0;
        size = o1 - 0xA0;
      }
    }
    
    tmp = [];
    i_holder.i = pos;
    
    // Case: byte-string
    if (type == 0xA0) {
      for (; i < size; i++) {
        tmp.push(String.fromCharCode(octets[pos + i]));
      }
      i_holder.i += size;
      return decodeURIComponent(escape(tmp.join('')));
    }
    
    // Case: unsupported type
    if (type == -1) {
      if (err) {
        err();
      }
    }
    else {
      
      // Case: list
      if (type == 0x90) {
        for (; i < size; i++) {
          tmp.push(arguments_callee(octets, i_holder, err));
        }
      }
      
      // Case: dict
      if (type == 0x80) {
        tmp = {}
        for (; i < size; i++) {
          tmp2 = arguments_callee(octets, i_holder, err);
          tmp['' + tmp2] = arguments_callee(octets, i_holder, err);
        }
      }
      
      return tmp;
    }
  };
})();
