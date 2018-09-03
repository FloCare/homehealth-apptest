const Realm = require('realm');

export class Task extends Realm.Object {
    static getSchemaName() {
        return 'Task';
    }
}
