(function() {
  
  exports['f'] = function(s) {
    
    var BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    
    var octets = [];
    var numChars = s.length - (s.match(/=+/) || [''])[0].length;
    
    var i = 0;
    while (i < numChars) {
      combined = (
            ((BASE64_ALPHABET.indexOf(s[i]) % 64) << 18) |
            ((BASE64_ALPHABET.indexOf(s[i + 1]) % 64) << 12) |
            ((BASE64_ALPHABET.indexOf(s[i + 2]) % 64) << 6) |
            (BASE64_ALPHABET.indexOf(s[i + 3]) % 64));
      i += 4;
      
      octets.push((combined >> 16) & 0xFF);
      if ((i - 1) <= numChars) {
        octets.push((combined >> 8) & 0xFF);
        if ((i - 1) < numChars) {
          octets.push((combined) & 0xFF);
        }
      }
    }
    
    
    
    return octets;
  };
  
})();
