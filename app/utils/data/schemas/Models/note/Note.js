const Realm = require('realm');

export class Note extends Realm.Object {

    static getSchemaName() {
        return 'Note';
    }
}
