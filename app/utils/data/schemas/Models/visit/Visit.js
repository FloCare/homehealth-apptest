import * as CollectionUtils from '../../../../collectionUtils';

const Realm = require('realm');

export class Visit extends Realm.Object {

    static getSchemaName() {
        return 'Visit';
    }

    static getAllFields() {
        return Object.keys(Visit.schema.properties);
    }

    get key() {
        return this.visitID;
    }

    getEpisode() {
        return CollectionUtils.getFirstElement(this.episode);
    }

    getDiagnosis() {
        if (this.getPatient()) {
            return this.getPatient().diagnosis;
        }
        return undefined;
    }

    getPatient() {
        const episode = this.getEpisode();
        if (episode) {
            return episode.getPatient();
        }
        return undefined;
    }

    getPlace() {
        return CollectionUtils.getFirstElement(this.place);
    }

    getAddress() {
        return this.getFromSubject(patient => patient.address, place => place.address);
    }

    getAssociatedName() {
        return this.getFromSubject(patient => patient.name, place => place.name);
    }

    getAssociatedNumber() {
        return this.getFromSubject(patient => patient.primaryContact, place => place.primaryContact);
    }

    getFromSubject(patientHandler, placeHandler) {
        const patient = this.getPatient();
        if (patient) {
            return patientHandler(patient);
        }
        const place = CollectionUtils.getFirstElement(this.place);
        if (place) {
            return placeHandler(place);
        }
        throw new Error('Visit belongs to neither place nor patient');
    }

    isSubjectArchived() {
        if ((this.getPatient() && this.getPatient().archived) ||
            (this.getPlace() && this.getPlace().archived)
        ) {
            return true;
        }
        return false;
    }
}
