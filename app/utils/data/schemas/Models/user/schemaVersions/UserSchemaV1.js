import {User} from '../User';

export const UserSchemaV1 = {
    name: User.getSchemaName(),
    primaryKey: 'userID',
    properties: {
        userID: 'string',
        firstName: 'string',
        lastName: 'string',
        primaryContact: 'string?',
        role: 'string'
    }
};
