import {PhysicianDataService} from '../../../../../data_services/PhysicianDataService';

const Realm = require('realm');

export class Physician extends Realm.Object {

    static getSchemaName() {
        return 'Physician';
    }

    static getMandatoryKeys() {
        return ['id', 'npiId', 'firstName'];
    }

    get name() {
        PhysicianDataService.constructName(this.firstName, this.lastName);
    }

    get key() {
        return this.id;
    }

}
