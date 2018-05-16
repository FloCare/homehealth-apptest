function arrayBufferToString(buffer) {
  return String.fromCharCode.apply(null, new Int8Array(buffer));
}

function stringToArrayBuffer(str) {
  return (new Int8Array([].map.call(str,function(x){return x.charCodeAt(0)}))).buffer;
}

function generateRandomString() {
	 var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	 var stringLength = 32;
	 var randomstring = '';
	 for (var i=0; i<stringLength; i++) {
	  var rnum = Math.floor(Math.random() * chars.length);
	  randomstring += chars.substring(rnum,rnum+1);
	 }
}

export {arrayBufferToString, stringToArrayBuffer, generateRandomString};