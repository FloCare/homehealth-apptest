import {Physician} from '../Physician';

export const PhysicianSchemaV1 = {
    name: Physician.getSchemaName(),
    primaryKey: 'physicianID',
    properties: {
        physicianID: 'string',
        npiId: 'string',
        firstName: 'string',
        lastName: 'string?',
        phone1: 'string?',
        phone2: 'string?',
        faxNo: 'string?'
    }
};
