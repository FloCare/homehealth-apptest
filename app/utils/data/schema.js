//TODO mark optional fields as such

export const PatientSchema = {
    name: 'Patient',
    primaryKey: 'patientID',
    properties: {
        patientID: 'string',
        name: 'string',
        streetAddress: 'string?',
        zipCode: 'string',
        city: 'string?',
        diagnosis: 'string?',
        primaryContact: 'string',
        emergencyContact: 'string?',
        notes: 'string?',
        midnightEpoch: 'int',
    }
};

export const Diagnosis = {
    name: 'Diagnosis',
    primaryKey: 'diagnosisId',
    properties: {
        diagnosisId: 'string',
        name: 'string',
    }
}

export const CaseSchema = {
    name: 'Case',
    primaryKey: 'caseID',
    properties: {
        caseID:     'string',
        patientID:  {type: 'string', indexed: true},
        diagnosis:  'string[]',
        //TODO referring physician?
        isClosed:   {type: 'bool', default: false}
    }
};

export const VisitSchema = {
    name: 'Visit',
    primaryKey: 'visitID',
    properties: {
        visitID:        'string',
        caseID:         {type: 'string', indexed: true},
        midnightEpoch:  'int',
        timestamp:      'int?',
        isClosed:       {type: 'bool', default: false}
    }
};

export const NoteSchema = {
    name: 'Note',
    primaryKey: 'noteID',
    properties: {
        noteID:     'string',
        caseID:     'string',
        body:       'string',
        timestamp:  'int'
    }
};

export const AddressSchema = {
    name: 'Address',
    primaryKey: 'addressID',
    properties: {
        addressID:  'string',
        lineOne:    'string',
        lineTwo:    'string',
        zip:        'string',
        city:       'string',
        state:      'string'
    }
};