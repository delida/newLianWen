var sjcl = require('sjcl');
var sjclRandom = new sjcl.prng(10);

var RNRandomBytes = require('react-native').NativeModules.RNRandomBytes;

module.exports.randomBytes = function(length, cb) {

  if (!cb) {
    var size = length;
    var wordCount = Math.ceil(size * 0.25);
    var randomBytes = sjclRandom.randomWords(wordCount, 10);
    var hexString = sjcl.codec.hex.fromBits(randomBytes);
    hexString = hexString.substr(0, size * 2);

    return new Buffer(hexString, 'hex');
  }

  RNRandomBytes.randomBytes(length, function(err, base64String) {
    if (err) {
      cb(err);
    } else {
      cb(null, new Buffer(base64String, 'base64'));
    }
  });

};