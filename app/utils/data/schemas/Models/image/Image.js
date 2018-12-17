const Realm = require('realm');

export class Image extends Realm.Object {

    static getSchemaName() {
        return 'Image';
    }
}
