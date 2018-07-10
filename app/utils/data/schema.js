import moment from 'moment/moment';
import {todayMomentInUTCMidnight} from '../utils';
import {stringToArrayBuffer} from '../encryptionUtils';
import * as Migrations from './schemas/migrations/MigrationsIndex';
import {Address} from './schemas/Models/address/Address';
import {Episode} from './schemas/Models/episode/Episode';
import {Patient} from './schemas/Models/patient/Patient';
import {Place} from './schemas/Models/place/Place';
import {Visit} from './schemas/Models/visit/Visit';
import {VisitOrder} from './schemas/Models/visitOrder/VisitOrder';
import * as PatientSchemas from './schemas/Models/patient/schemaVersions/SchemaIndex';
import * as AddressSchemas from './schemas/Models/address/schemaVersions/SchemaIndex';
import * as EpisodeSchemas from './schemas/Models/episode/schemaVersions/SchemaIndex';
import * as PlaceSchemas from './schemas/Models/place/schemaVersions/SchemaIndex';
import * as VisitSchemas from './schemas/Models/visit/schemaVersions/SchemaIndex';
import * as VisitOrderSchemas from './schemas/Models/visitOrder/schemaVersions/SchemaIndex';

const Realm = require('realm');

let floDB = null;

class FloDBProvider {
    static get db() {
        return floDB;
    }

    static initialize(key) {
        console.log('initializing the DB ...');

        // 0th element intentionally left blank to make index of the array match with schema version
        const schemaMigrations = [
            {

            },
            {
                schema: [VisitSchemas.VisitSchemaV1, PatientSchemas.PatientSchemaV3, AddressSchemas.AddressSchemaV1,
                    EpisodeSchemas.EpisodeSchemaV1, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1],
                schemaVersion: 1,
                migration: () => { console.log('Migration function goes here'); },
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key)
            },
            {
                schema: [VisitSchemas.VisitSchemaV1, PatientSchemas.PatientSchemaV3, AddressSchemas.AddressSchemaV1,
                    EpisodeSchemas.EpisodeSchemaV1, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1],
                schemaVersion: 2,
                migration: (oldRealm, newRealm) => {
                    if (oldRealm.schemaVersion < 2) {
                        const newPatientObjects = newRealm.objects(Patient.getSchemaName());
                        newPatientObjects.update('archived', false);
                        const newPlaceObjects = newRealm.objects(Place.getSchemaName());
                        newPlaceObjects.update('archived', false);
                    }
                },
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key)
            },
            {
                schema: [VisitSchemas.VisitSchemaV1, PatientSchemas.PatientSchemaV3, AddressSchemas.AddressSchemaV1,
                    EpisodeSchemas.EpisodeSchemaV1, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1],
                schemaVersion: 3,
                migration: (oldRealm, newRealm) => {
                    if (oldRealm.schemaVersion < 3) {
                        const newPatientObjects = newRealm.objects(Patient.getSchemaName());
                        newPatientObjects.update('isLocallyOwned', true);
                    }
                },
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key),
            },
            {
                schema: [VisitSchemas.VisitSchemaV1, PatientSchemas.PatientSchemaV4, AddressSchemas.AddressSchemaV1,
                    EpisodeSchemas.EpisodeSchemaV1, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1],
                schemaVersion: 4,
                migration: Migrations.SplitNameToFirstNameLastNameMigration,
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key),
            },
            {
                schema: [VisitSchemas.VisitSchemaV1, PatientSchemas.PatientSchemaV5, AddressSchemas.AddressSchemaV1,
                    EpisodeSchemas.EpisodeSchemaV1, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1],
                schemaVersion: 5,
                migration: Migrations.v005,
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key),
            }
        ];

        const targetSchemaVersion = schemaMigrations[schemaMigrations.length - 1].schemaVersion;
        const models = [Visit, Patient, Address, Episode, Place, VisitOrder];

        let currentSchemaVersion = Realm.schemaVersion('database.realm', stringToArrayBuffer(key));
        if (currentSchemaVersion >= 0) {
            // Run migrations if schema exists
            while (currentSchemaVersion < targetSchemaVersion) {
                const migratedRealm = new Realm(schemaMigrations[currentSchemaVersion++]);
                migratedRealm.close();
            }
        }

        // Setting schema for each model
        models.forEach((realmModel) => {
            realmModel.schema = schemaMigrations[targetSchemaVersion].schema.find(
                (schema) => schema.name === realmModel.getSchemaName());
        });

        try {
            // initializing the DB synchronously
            floDB = new Realm({
                schema: models,
                schemaVersion: schemaMigrations[targetSchemaVersion].schemaVersion,
                encryptionKey: schemaMigrations[targetSchemaVersion].encryptionKey,
                path: schemaMigrations[targetSchemaVersion].path,
                migration: schemaMigrations[targetSchemaVersion].migration
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
                firstName: 'Joh',
                lastName: `n_${Math.round(Math.random() * 100)}`,
                primaryContact: `99647165${Math.round(Math.random() * 100)}`,
                timestamp: moment().utc().valueOf(),
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

    console.log('==========================================');
    console.log('Done Creating Realm objects');
    console.log('Total time taken for insertions:', Date.now() - timeNow);
    console.log('==========================================');
}

export {FloDBProvider, floDB, Patient, Episode, Visit, Place, Address, VisitOrder, CreateAndSaveDummies};
