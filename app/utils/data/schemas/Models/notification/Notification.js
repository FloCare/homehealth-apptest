const Realm = require('realm');

export class Notification extends Realm.Object {

    static getSchemaName() {
        return 'Notification';
    }
}
