export const PatientSchemaV5 = {
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
        creationTimestamp: 'int',
        assignmentTimestamp: 'int',
        lastUpdateTimestamp: 'int',
        archived: {type: 'bool', default: false},
        isLocallyOwned: {type: 'bool', default: true},
        dateOfBirth: {type: 'date?', default: null},
        emergencyContactNumber: {type: 'string?', default: null},
        emergencyContactName: {type: 'string?', default: null},
        emergencyContactRelation: {type: 'string?', default: null},
    }
};
