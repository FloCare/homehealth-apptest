const Realm = require('realm');

export class VisitOrder extends Realm.Object {

    static getSchemaName(){
        return 'VisitOrder';
    }

}