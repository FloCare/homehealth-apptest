import {Place} from '../Place';

export const PlaceSchemaV2 = {
    name: Place.getSchemaName(),
    primaryKey: 'placeID',
    properties: {
        placeID: 'string',
        name: 'string',
        address: 'Address',
        primaryContact: 'string?',
        visits: {type: 'Visit[]', default: []},
        archived: {type: 'bool', default: false},
        isLocallyOwned: {type: 'bool', default: true}
    }
};
