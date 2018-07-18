const Realm = require('realm');

export class User extends Realm.Object {

    static getSchemaName() {
        return 'User';
    }

    get key() {
        return this.placeID;
    }
}
