import {Physician} from "../../../../schema";

export const PhysicianSchemaV1 = {
    name: Physician.getSchemaName(),
    primaryKey: 'physicianId',
    properties: {
        physicianId: 'string',
        npiId: 'string',
        firstName: 'string',
        lastName: 'string?',
        contactNo: 'string?',
        faxNo: 'string?'
    }
};