import {User} from '../User';

export const UserSchemaV2 = {
    name: User.getSchemaName(),
    primaryKey: 'userID',
    properties: {
        userID: 'string',
        episodes: {type: 'linkingObjects', objectType: 'Episode', property: 'careTeam'},     // set automatically
        firstName: 'string',
        lastName: 'string',
        primaryContact: 'string?',
        role: 'string'
    }
};
