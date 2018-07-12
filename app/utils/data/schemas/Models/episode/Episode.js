import * as CollectionUtils from "../../../../collectionUtils";

const Realm = require('realm');

// 1 patient can have multiple episodes
export class Episode extends Realm.Object {

    static getSchemaName(){
        return 'Episode';
    }

    getPatient() {
        return CollectionUtils.getFirstElement(this.patient);
    }
}