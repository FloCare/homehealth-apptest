
import Realm from 'realm';

class CredentialSchema extends Realm.Object {}
CredentialSchema.schema = {
    name: 'CredentialSchema',
    properties: {
        username: 'string',
        pass: 'string'
    },
};

const key = new Int8Array(64);
//console.log('key:' + String(key));
// Store in keychain: https://github.com/oblador/react-native-keychain#usage


export default new Realm({ 
	schema: [CredentialSchema], 
	encryptionKey: key,
	path: 'anotherRealm.realm'
});
