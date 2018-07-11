import {Address} from "../Address";

export const AddressSchemaV1 = {
    name: Address.getSchemaName(),
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