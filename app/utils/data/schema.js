const Realm = require('realm');

class Patient extends Realm.Object {}
Patient.schema = {
    name: 'Patient',
    primaryKey: 'patientID',
    properties: {
        patientID: 'string',
        name: 'string',
        address: 'Address',                                                      // optional by default
        primaryContact: 'string',
        emergencyContact: 'string?',
        notes: 'string?',
        episodes: {type: 'list', objectType: 'Episode', default: []},            // cannot be optional
        timestamp: 'int'
    }
};

// Todo: Check if inverse relationship needed

// Address can belong to a 'Patient' or a 'Place'
class Address extends Realm.Object {}
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
        country: {type: 'string?', default: 'USA'},
        latLong: 'LatLong'                                                                 // optional by default
    }
};

class LatLong extends Realm.Object {}
LatLong.schema = {
    name: 'LatLong',
    primaryKey: 'latLongID',
    properties: {
        latLongID: 'string',
        lat: 'int',
        long: 'int',
        address: {type: 'linkingObjects', objectType: 'Address', property: 'latLong'}       // set automatically
    }
};

// 1 patient can have multiple episodes
class Episode extends Realm.Object {}
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

class Place extends Realm.Object {}
Place.schema = {
    name: 'Place',
    primaryKey: 'placeID',
    properties: {
        placeID: 'string',
        name: 'string',
        address: 'Address'
    }
};

class Visit extends Realm.Object {}
Visit.schema = {
    name: 'Visit',
    primaryKey: 'visitID',
    properties: {
        visitID: 'string',
        episode: {type: 'linkingObjects', objectType: 'Episode', property: 'visits'},       // set automatically
        midnightEpoch: 'int',
        timestamp: 'int?',
        isDone: {type: 'bool', default: false}
    }
};

const floDB = new Realm({
    schema: [
        LatLong.schema,
        Visit.schema,
        Patient.schema,
        Address.schema,
        Episode.schema,
        Place.schema
    ],
    deleteRealmIfMigrationNeeded: true
});


//TODO remove this code, for debug only
// Todo: Add try-catch for all write blocks
function CreateAndSaveDummies() {
    const timeNow = Date.now();

    const latLongID = `${Math.random().toString()}_LatLong`;
    const addressID = `${Math.random().toString()}_Address`;
    const episodeID = `${Math.random().toString()}_Episode`;
    const patientID = `${Math.random().toString()}_Patient`;
    const visitID = `${Math.random().toString()}_Visit`;

    console.log('==========================================');
    console.log('Creating Realm objects');
    console.log('==========================================');

    floDB.write(() => {
        // Create the patient
        const patient = floDB.create(
            Patient.schema.name, {
                patientID,
                name: `John_${Math.round(Math.random() * 100)}`,
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
            country: 'India'
        };
        // Create a LatLong for that address
        patient.address.latLong = {
            latLongID,
            lat: 1.0,
            long: 1.0
        };
        // Create an Episode
        patient.episodes.push({
            episodeID,
            diagnosis: ['A', 'B', 'C'],
            isClosed: true
        });
        patient.episodes[0].visits.push({
            visitID,
            midnightEpoch: 0
        });
    });

    console.log('==========================================');
    console.log('Done Creating Realm objects');
    console.log('Total time taken for insertions:', Date.now() - timeNow);
    console.log('==========================================');
}

export {floDB, Patient, Episode, Visit, Place, Address, LatLong, CreateAndSaveDummies};
