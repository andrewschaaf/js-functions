(function() {
  
  exports['f'] = function(octets) {
    
    var BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    
    var combined, i, numOctets, paddingLength, s, strings;
    
    strings = [];
    numOctets = octets.length;
    i = 0;
    while (i < numOctets) {
      combined = (
          (octets[i] || 0) << 16) | 
          ((octets[i + 1] || 0) << 8) | 
          (octets[i + 2] || 0);
      i += 3;
      strings.push(
          BASE64_ALPHABET.charAt((combined >> 18) & 0x3F) +
          BASE64_ALPHABET.charAt((combined >> 12) & 0x3F) +
          BASE64_ALPHABET.charAt((combined >> 6) & 0x3F) +
          BASE64_ALPHABET.charAt(combined & 0x3F));
    }
    
    // 0 ''            
    // 1 'AA=='        
    // 2 'AAA='        
    // 3 'AAAA'        
    // 4 'AAAAAA=='    
    // 5 'AAAAAAA='    
    // 6 'AAAAAAAA'    
    paddingLength = [0, 2, 1][numOctets % 3];
    s = strings.join('');
    return (
              s.substr(0, s.length - paddingLength) + 
              (['', '=', '=='][paddingLength]));
  };
  
})();
