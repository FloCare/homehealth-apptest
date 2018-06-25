import * as CollectionUtils from '../collectionUtils';
import {todayMomentInUTCMidnight} from '../utils';
import {stringToArrayBuffer} from '../encryptionUtils';
import {PatientDataService} from "../../data_services/PatientDataService";

const Realm = require('realm');

class Patient extends Realm.Object {
    get key() {
        return this.patientID;
    }

    getFirstEpisode() {
        return CollectionUtils.getFirstElement(this.episodes);
    }

    get name() {
        return PatientDataService.constructName(this.firstName, this.lastName);
    }

}

export const PatientSchema = {
    name: 'Patient',
    primaryKey: 'patientID',
    properties: {
        patientID: 'string',
        firstName: 'string',
        lastName: 'string?',
        address: 'Address',                                                      // optional by default
        primaryContact: 'string',
        emergencyContact: 'string?',
        notes: 'string?',
        episodes: {type: 'list', objectType: 'Episode', default: []},            // cannot be optional
        timestamp: 'int',
        archived: {type: 'bool', default: false},
        isLocallyOwned: {type: 'bool', default: true},
    }
};

Patient.schema = PatientSchema;

// Todo: Check if inverse relationship needed

// Address can belong to a 'Patient' or a 'Place'
class Address extends Realm.Object {
    get formattedAddressForGeocoding() {
        let addr = '';
        if (this.apartmentNo) {
            addr += `${this.apartmentNo}, `;
        }
        if (this.streetAddress) {
            addr += `${this.streetAddress}`;
        }
        if (this.city) {
            addr += `, ${this.city}`;
        }
        return addr;
    }

    get formattedAddress() {
        let addr = this.formattedAddressForGeocoding;
        if (this.zipCode) {
            addr += ` ${this.zipCode}`;
        }
        if (this.state) {
            addr += `, ${this.state}`;
        }
        return addr;
    }

    get formattedCompleteAddress() {
        let addr = this.formattedAddress;
        if (this.country) {
            addr += `, ${this.country}`;
        }
        return addr;
    }

    get coordinates() {
        if (!(this.latitude && this.longitude)) { return null; }
        return {
            latitude: this.latitude,
            longitude: this.longitude
        };
    }

    set coordinates(coordinates) {
        this.latitude = coordinates.latitude;
        this.longitude = coordinates.longitude;
    }

    getCommaSeperatedCoordinates() {
        return `${this.latitude},${this.longitude}`;
    }

    hasCoordinates() {
        return !!((
            (this.latitude !== null) &&
            (this.longitude !== null)
        ));
    }
}

Address.schema = {
    name: 'Address',
    primaryKey: 'addressID',
    properties: {
        addressID: 'string',
        apartmentNo: 'string?',
        streetAddress: 'string?',
        zipCode: 'string?',
        city: 'string?',
        state: 'string?',
        country: {type: 'string?', default: 'US'},     // Todo: Remove
        latitude: 'double?',
        longitude: 'double?',
        isValidated: {type: 'bool', default: false}
    }
};

// 1 patient can have multiple episodes
class Episode extends Realm.Object {
    getPatient() {
        return CollectionUtils.getFirstElement(this.patient);
    }
}

Episode.schema = {
    name: 'Episode',
    primaryKey: 'episodeID',
    properties: {
        episodeID: 'string',
        patient: {type: 'linkingObjects', objectType: 'Patient', property: 'episodes'},     // set automatically
        diagnosis: 'string[]',
        visits: {type: 'list', objectType: 'Visit', default: []},                           // cannot be optional
        isClosed: {type: 'bool', default: false}
    }
};

class Place extends Realm.Object {
    get key() {
        return this.placeID;
    }
}

Place.schema = {
    name: 'Place',
    primaryKey: 'placeID',
    properties: {
        placeID: 'string',
        name: 'string',
        address: 'Address',
        primaryContact: 'string?',
        visits: {type: 'Visit[]', default: []},
        archived: {type: 'bool', default: false}
    }
};

class Visit extends Realm.Object {
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
        return this.getFromOwner(patient => patient.address, place => place.address);
    }

    getAssociatedName() {
        return this.getFromOwner(patient => patient.name, place => place.name);
    }

    getAssociatedNumber() {
        return this.getFromOwner(patient => patient.primaryContact, place => place.primaryContact);
    }

    getFromOwner(patientHandler, placeHandler) {
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

    isOwnerArchived() {
        if ((this.getPatient() && this.getPatient().archived) ||
            (this.getPlace() && this.getPlace().archived)
        ) {
            return true;
        }
        return false;
    }
}

Visit.schema = {
    name: 'Visit',
    primaryKey: 'visitID',
    properties: {
        visitID: 'string',
        episode: {type: 'linkingObjects', objectType: 'Episode', property: 'visits'},       // set automatically
        place: {type: 'linkingObjects', objectType: 'Place', property: 'visits'},
        midnightEpochOfVisit: 'int',

        isDone: {type: 'bool', default: false},
        timeOfCompletion: 'int?',

        isDeleted: {type: 'bool', default: false}
    }
};

class VisitOrder extends Realm.Object {
}

VisitOrder.schema = {
    name: 'VisitOrder',
    primaryKey: 'midnightEpoch',
    properties: {
        midnightEpoch: 'int',
        visitList: 'Visit[]'
    }
};

let floDB = null;

class FloDBProvider {
    static get db() {
        return floDB;
    }

    static initialize(key) {
        console.log('initializing the DB ...');
        const initialSchema = [Visit, Patient, Address, Episode, Place, VisitOrder];
        const schemas = [
            {
                schema: initialSchema,
                schemaVersion: 1,
                migration: () => { console.log('Migration function goes here'); },
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key)
            },
            {
                schema: initialSchema,
                schemaVersion: 2,
                migration: (oldRealm, newRealm) => {
                    if (oldRealm.schemaVersion < 2) {
                        const newPatientObjects = newRealm.objects(Patient.schema.name);
                        newPatientObjects.update('archived', false);
                        const newPlaceObjects = newRealm.objects(Place.schema.name);
                        newPlaceObjects.update('archived', false);
                    }
                },
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key)
            },
            {
                schema: initialSchema,
                schemaVersion: 3,
                migration: (oldRealm, newRealm) => {
                    if (oldRealm.schemaVersion < 3) {
                        const newPatientObjects = newRealm.objects(Patient.schema.name);
                        newPatientObjects.update('isLocallyOwned', true);
                    }
                },
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key),
            },
            {
                schema: initialSchema,
                schemaVersion: 4,
                migration: (oldRealm, newRealm) => {
                    if (oldRealm.schemaVersion < 4) {
                        const oldPatientObjects = oldRealm.objects(Patient.schema.name);
                        const newPatientObjects = newRealm.objects(Patient.schema.name);

                        for (let i = 0; i < oldPatientObjects.length; i++) {
                            const separatorIndex = oldPatientObjects[i].name.indexOf(" ");
                            if (separatorIndex < 0){
                                newPatientObjects[i].firstName = oldPatientObjects[i].name;
                                newPatientObjects[i].lastName = null;
                            }
                            else{
                                newPatientObjects[i].firstName = oldPatientObjects[i].name.substr(0, separatorIndex);
                                newPatientObjects[i].lastName = oldPatientObjects[i].name.substr(separatorIndex + 1);
                            }
                        }
                    }
                },
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key),
            }
        ];

        let nextSchemaIndex = Realm.schemaVersion('database.realm', stringToArrayBuffer(key));
        if (nextSchemaIndex < 0) {
            nextSchemaIndex = 0;
        }
        while (nextSchemaIndex < schemas.length - 1) {
            const migratedRealm = new Realm({
                schema: schemas[nextSchemaIndex].schema,
                schemaVersion: schemas[nextSchemaIndex].schemaVersion,
                encryptionKey: schemas[nextSchemaIndex].encryptionKey,
                path: schemas[nextSchemaIndex].path,
                migration: schemas[nextSchemaIndex].migration
            });
            migratedRealm.close();
            nextSchemaIndex++;
        }

        const lastIndex = schemas.length - 1;
        try {
            // initializing the DB synchronously
            floDB = new Realm({
                schema: schemas[lastIndex].schema,
                schemaVersion: schemas[lastIndex].schemaVersion,
                encryptionKey: schemas[lastIndex].encryptionKey,
                path: schemas[lastIndex].path,
                migration: schemas[lastIndex].migration
            });
            console.log('initialization done ...');
        } catch (err) {
            console.log('ERROR IN DB INITIALIZATION: ', err);
            throw err;
        }
    }
}


//TODO remove this code, for debug only
// Todo: Add try-catch for all write blocks
function CreateAndSaveDummies() {
    const timeNow = Date.now();

    const addressID = `${Math.random().toString()}_Address`;
    const episodeID = `${Math.random().toString()}_Episode`;
    const patientID = `${Math.random().toString()}_Patient`;
    const visitID = `${Math.random().toString()}_Visit`;

    console.log('==========================================');
    console.log('Creating Realm objects');
    console.log('==========================================');

    const midnightEpoch = todayMomentInUTCMidnight().valueOf();

    // Only call after initialising the DB

    let orderObject = floDB.objectForPrimaryKey(VisitOrder, midnightEpoch);
    if (!orderObject) {
        floDB.write(() => {
            orderObject = floDB.create(VisitOrder, {midnightEpoch, visitIDList: []});
        });
    }

    floDB.write(() => {
        // Create the patient
        const patient = floDB.create(
            Patient.schema.name, {
                patientID,
                firstName: `Joh`,
                lastName: `n_${Math.round(Math.random() * 100)}`,
                primaryContact: `99647165${Math.round(Math.random() * 100)}`,
                timestamp: 0
            });
        // Create the corresponding address
        patient.address = {
            addressID,
            streetAddress: 'Eat street',
            zipCode: '12345',
            city: 'Bangalore',
            state: 'KA',
            country: 'India',
            isValidated: true
        };
        // Create a LatLong for that address
        patient.address.coordinates = {
            latitude: 37.3 + 0.05 * Math.random(),
            longitude: -122 + 0.05 * Math.random()
        };
        // Create an Episode
        patient.episodes.push({
            episodeID,
            diagnosis: ['A', 'B', 'C'],
            isClosed: true
        });
        // patient.episodes[0].visits.push({
        //     visitID,
        //     midnightEpochOfVisit: midnightEpoch
        // });
    });

    console.log("with undefined");
    console.log(floDB.objects(Patient.schema.name).filtered('archived = false'));

    console.log('==========================================');
    console.log('Done Creating Realm objects');
    console.log('Total time taken for insertions:', Date.now() - timeNow);
    console.log('==========================================');
}

export {FloDBProvider, floDB, Patient, Episode, Visit, Place, Address, VisitOrder, CreateAndSaveDummies};
