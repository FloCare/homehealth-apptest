const Realm = require('realm');

export class Place extends Realm.Object {

    static getSchemaName(){
        return 'Place';
    }

    get key() {
        return this.placeID;
    }
}