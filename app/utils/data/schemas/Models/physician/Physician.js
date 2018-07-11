const Realm = require('realm');

export class Physician extends Realm.Object {

    static getSchemaName() {
        return 'Physician';
    }

    static getMandatoryKeys (){
        return ['physicianId', 'npiId', 'firstName'];
    }

    get key() {
        return this.physicianId;
    }

}