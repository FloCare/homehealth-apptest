import moment from 'moment/moment';
import {todayMomentInUTCMidnight} from '../utils';
import {stringToArrayBuffer} from '../encryptionUtils';
import * as Migrations from './schemas/migrations/MigrationsIndex';
import {Address} from './schemas/Models/address/Address';
import {Episode} from './schemas/Models/episode/Episode';
import {Patient} from './schemas/Models/patient/Patient';
import {Place} from './schemas/Models/place/Place';
import {User} from './schemas/Models/user/User';
import {Visit} from './schemas/Models/visit/Visit';
import {VisitOrder} from './schemas/Models/visitOrder/VisitOrder';
import {Physician} from './schemas/Models/physician/Physician';
import {Task} from './schemas/Models/task/Task';
import {VisitMiles} from './schemas/Models/visitMiles/VisitMiles';
import {ReportItem} from './schemas/Models/reportItem/ReportItem';
import {Report} from './schemas/Models/report/Report';
import * as PatientSchemas from './schemas/Models/patient/schemaVersions/SchemaIndex';
import * as AddressSchemas from './schemas/Models/address/schemaVersions/SchemaIndex';
import * as EpisodeSchemas from './schemas/Models/episode/schemaVersions/SchemaIndex';
import * as PlaceSchemas from './schemas/Models/place/schemaVersions/SchemaIndex';
import * as UserSchemas from './schemas/Models/user/schemaVersions/SchemaIndex';
import * as VisitSchemas from './schemas/Models/visit/schemaVersions/SchemaIndex';
import * as VisitOrderSchemas from './schemas/Models/visitOrder/schemaVersions/SchemaIndex';
import * as PhysicianSchemas from './schemas/Models/physician/schemaVersions/SchemaIndex';
import * as TaskSchemas from './schemas/Models/task/schemaVersions/SchemaIndex';
import * as NotificationSchemas from './schemas/Models/notification/schemaVersions/SchemaIndex';
import * as VisitMilesSchemas from './schemas/Models/visitMiles/schemaVersions/SchemaIndex';
import * as ReportItemSchemas from './schemas/Models/reportItem/schemaVersions/SchemaIndex';
import * as ReportSchemas from './schemas/Models/report/schemaVersions/SchemaIndex';
import {PhysicianDataService} from '../../data_services/PhysicianDataService';
import {UserDataService} from '../../data_services/UserDataService';
import {getPatientsByOldID} from '../API/PatientAPI';
import {arrayToObjectByKey} from '../collectionUtils';
import {setItem} from '../InMemoryStore';

const Realm = require('realm');

let floDB = null;

class FloDBProvider {
    static get db() {
        return floDB;
    }

    static async initialize(key) {
        console.log('initializing the DB ...');

        // 0th element intentionally left blank to make index of the array match with schema version
        const schemaMigrations = [
            {

            },
            {
                schema: [VisitSchemas.VisitSchemaV1, PatientSchemas.PatientSchemaV3, AddressSchemas.AddressSchemaV1,
                    EpisodeSchemas.EpisodeSchemaV1, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1],
                schemaVersion: 1,
                migration: () => {
                    console.log('Migration function goes here');
                },
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
            },
            // {
            //     schema: [VisitSchemas.VisitSchemaV1, PatientSchemas.PatientSchemaV5, AddressSchemas.AddressSchemaV1,
            //         EpisodeSchemas.EpisodeSchemaV1, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1],
            //     schemaVersion: 6,
            //     prerequisite: () => {
            //         //TODO get realm old patient to new patient data
            //         setItem('patientMigrationMapping', {
            //             18: 'xyz1',
            //             19: 'xyz2',
            //             20: 'xyz3',
            //         });
            //     },
            //     migration: (oldRealm, newRealm) => {
            //         if (oldRealm.schemaVersion < 6) {
            //             const newPatientObjects = newRealm.objects(Patient.getSchemaName());
            //
            //             for (let i = 0; i < newPatientObjects.length; i++) {
            //                 if (getItem('patientMigrationMapping')[newPatientObjects[i].patientID]) { newPatientObjects[i].patientID = getItem('patientMigrationMapping')[newPatientObjects[i].patientID]; } else console.log('not found');
            //             }
            //         }
            //     },
            //     path: 'database.realm',
            //     encryptionKey: stringToArrayBuffer(key),
            // }
            {
                schema: [VisitSchemas.VisitSchemaV1, PatientSchemas.PatientSchemaV5, AddressSchemas.AddressSchemaV1,
                    EpisodeSchemas.EpisodeSchemaV2, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1,
                    PhysicianSchemas.PhysicianSchemaV1],
                schemaVersion: 6,
                migration: () => {
                    console.log('Migrating to v6. Adding physician');
                },
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key),
            },
            {
                schema: [VisitSchemas.VisitSchemaV2, PatientSchemas.PatientSchemaV5, AddressSchemas.AddressSchemaV1,
                    EpisodeSchemas.EpisodeSchemaV2, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1,
                    UserSchemas.UserSchemaV1, PhysicianSchemas.PhysicianSchemaV1],
                schemaVersion: 7,
                prerequisite: async oldRealm => {
                    const allPatients = oldRealm.objects(Patient.getSchemaName());
                    await getPatientsByOldID(allPatients.filtered('isLocallyOwned = false').map(patient => patient.patientID))
                        .then(responseJson => {
                            const patientJsonByOldID = arrayToObjectByKey(responseJson.success, 'id');
                            setItem('patientJsonByOldID', patientJsonByOldID);
                        }).catch(error => {
                            console.log('error in prereq for migrating patient ids');
                            console.log(error);
                            throw error;
                        });
                },
                migration: Migrations.v007,
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key),
            },
            {
                schema: [VisitSchemas.VisitSchemaV3, PatientSchemas.PatientSchemaV5, AddressSchemas.AddressSchemaV1,
                    EpisodeSchemas.EpisodeSchemaV2, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1,
                    UserSchemas.UserSchemaV1, PhysicianSchemas.PhysicianSchemaV1, VisitMilesSchemas.VisitMilesSchemaV1,
                    ReportItemSchemas.ReportItemSchemaV1, ReportSchemas.ReportSchemaV1, TaskSchemas.TaskSchemaV1],
                schemaVersion: 8,
                migration: Migrations.v008,
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key),
            },
            {
                schema: [VisitSchemas.VisitSchemaV3, PatientSchemas.PatientSchemaV5, AddressSchemas.AddressSchemaV1,
                    EpisodeSchemas.EpisodeSchemaV2, PlaceSchemas.PlaceSchemaV1, VisitOrderSchemas.VisitOrderSchemaV1,
                    UserSchemas.UserSchemaV1, PhysicianSchemas.PhysicianSchemaV1, VisitMilesSchemas.VisitMilesSchemaV1,
                    ReportItemSchemas.ReportItemSchemaV1, ReportSchemas.ReportSchemaV1, TaskSchemas.TaskSchemaV1, NotificationSchemas.NotificationSchemaV1],
                schemaVersion: 9,
                path: 'database.realm',
                encryptionKey: stringToArrayBuffer(key),
            }
        ];

        const targetSchemaVersion = schemaMigrations[schemaMigrations.length - 1].schemaVersion;
        const models = [Visit, Patient, Address, Episode, Place, VisitOrder, User,
            Physician, VisitMiles, ReportItem, Report, Task];

        let existingSchemaVersion = Realm.schemaVersion('database.realm', stringToArrayBuffer(key));
        if (existingSchemaVersion >= 0) {
            // Run migrations if schema exists
            while (existingSchemaVersion < targetSchemaVersion) {
                if (schemaMigrations[existingSchemaVersion + 1].prerequisite) {
                    const previousRealm = new Realm(schemaMigrations[existingSchemaVersion]);
                    await schemaMigrations[existingSchemaVersion + 1].prerequisite(previousRealm);
                    previousRealm.close();
                }
                const migratedRealm = new Realm(schemaMigrations[existingSchemaVersion + 1]);
                migratedRealm.close();

                existingSchemaVersion++;
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
                migration: schemaMigrations[targetSchemaVersion].migration,
            });

            if (existingSchemaVersion === -1) {
                FloDBProvider.seedInitialData(floDB);
            }
            console.log('initialization done ...');
        } catch (err) {
            console.log('ERROR IN DB INITIALIZATION: ', err);
            throw err;
        }
    }

    static seedInitialData(db) {
        try {
            db.write(() => {
                const ownUser = db.create(User, UserDataService.getCurrentUserProps());
                console.log(ownUser);
            });
        } catch (e) {
            console.log('seedInitialData failed');
            console.log(e);
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
    const physicianID = `${Math.random().toString()}_Visit`;
    const npiId = Math.floor(Math.random() * 1000000000).toString();

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
                creationTimestamp: moment().utc().valueOf(),
                assignmentTimestamp: moment().utc().valueOf(),
                lastUpdateTimestamp: moment().utc().valueOf(),
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
        const primaryPhysician = PhysicianDataService.getInstance().createNewPhysician({
            physicianID,
            npiId,
            firstName: 'Bellandur',
            lastName: 'DrName',
            phone1: '9823401232',
            phone2: '9857401265',
            faxNo: '9378620212',
        });
        patient.episodes.push({
            episodeID,
            diagnosis: ['A', 'B', 'C'],
            isClosed: true,
            primaryPhysician
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

export {
    FloDBProvider, floDB, Patient, Episode, Visit, Place, Address,
    VisitOrder, User, Physician, VisitMiles, Report, ReportItem, Task, CreateAndSaveDummies
};
