const Realm = require('realm');

// Todo: Check if inverse relationship needed

// Notification can belong to a 'patient' or a 'Place'
export class Notification extends Realm.Object {

    static getSchemaName() {
        return 'Notification';
    }
}
