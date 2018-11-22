import {Note} from '../Note';
import {Episode} from '../../episode/Episode';
import {User} from '../../user/User';

export const NoteSchemaV1 = {
    name: Note.getSchemaName(),
    primaryKey: 'messageID',
    properties: {
        messageID: 'string',
        episode: {type: Episode.getSchemaName()},
        data: 'string',
        timetoken: {type: 'date', indexed: true},
        messageType: 'string',
        user: {type: User.getSchemaName()},
        superID: {type: 'string?', indexed: true},
        synced: 'string'
    }
};
