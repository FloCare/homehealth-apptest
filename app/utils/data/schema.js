//TODO mark optional fields as such

class Patient extends Realm.Object {}
Patient.schema = {
    name: 'Patient',
    primaryKey: 'patientID',
    properties: {
        patientID: 'string',
        name: 'string',
        emailID: 'string?',
        phoneNumber: 'string',
        addressID: 'string?',
        emergencyContact: 'string?'
    }
};

class Case extends Realm.Object {}
Case.schema = {
    name: 'Case',
    primaryKey: 'caseID',
    properties: {
        caseID: 'string',
        patientID: {type: 'string', indexed: true},
        diagnosis: 'string[]',
        //TODO referring physician?
        isClosed: {type: 'bool', default: false}
    }
};

class Visit extends Realm.Object {}
Visit.schema = {
    name: 'Visit',
    primaryKey: 'visitID',
    properties: {
        visitID: 'string',
        caseID: {type: 'string', indexed: true},
        midnightEpoch: 'int',
        timestamp: 'int?',
        isDone: {type: 'bool', default: false}
    }
};

//TODO change the way the schemas are defined to match the ones above
class Note extends Realm.Object {}
Note.schema = {
    name: 'Note',
    primaryKey: 'noteID',
    properties: {
        noteID: 'string',
        // caseID:     'string',
        // body:       'string',
        // timestamp:  'int'
    }
};

class Address extends Realm.Object {}
Address.schema = {
    name: 'Address',
    primaryKey: 'addressID',
    properties: {
        addressID: 'string',
        lineOne: 'string',
        lineTwo: 'string',
        zip: 'string',
        city: 'string',
        state: 'string'
    }
};

const MyRealm = new Realm({schema: [Visit.schema, Case.schema, Patient.schema]});

//TODO remove this code, for debug only
export function CreateAndSaveDummies() {
    const timeNow = Date.now();
    const caseID = `${Math.random().toString()}_Case`;
    const patientID = `${Math.random().toString()}_Patient`;

    MyRealm.write(() => {
        MyRealm.create(Visit.schema.name, {visitID: `${Math.random().toString()}_visit`, caseID, midnightEpoch: 0});
        MyRealm.create(Case.schema.name, {caseID, patientID, diagnosis: ['random1', 'random2']});
        MyRealm.create(Patient.schema.name, {patientID, name: 'aRoseByAnyOtherName_'+Math.round(Math.random() * 100), phoneNumber: 'number'});
    });
    console.log(Date.now() - timeNow);
}

export {MyRealm, Patient, Case, Visit, Note, Address};
