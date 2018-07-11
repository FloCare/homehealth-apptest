import * as CollectionUtils from "../../../../collectionUtils";
import {PatientDataService} from "../../../../../data_services/PatientDataService";

const Realm = require('realm');

export class Patient extends Realm.Object {

    static getSchemaName() {
        return 'Patient';
    }

    get key() {
        return this.patientID;
    }

    getFirstEpisode() {
        return CollectionUtils.getFirstElement(this.episodes);
    }

    get name() {
        return PatientDataService.constructName(this.firstName, this.lastName);
    }

    get primaryPhysician(){
        if (this.episodes.length === 0) return null;
        return this.episodes[this.episodes.length - 1].primaryPhysician;
    }

}