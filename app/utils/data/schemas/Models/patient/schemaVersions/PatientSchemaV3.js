import {Patient} from '../Patient';

export const PatientSchemaV3 = {
    name: Patient.getSchemaName(),
    primaryKey: 'patientID',
    properties: {
        patientID: 'string',
        name: 'string',
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