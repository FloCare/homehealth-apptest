import {Episode} from '../Episode';

export const EpisodeSchemaV3 = {
    name: Episode.getSchemaName(),
    primaryKey: 'episodeID',
    properties: {
        episodeID: 'string',
        patient: {type: 'linkingObjects', objectType: 'Patient', property: 'episodes'},     // set automatically
        careTeam: 'User[]',
        notes: {type: 'linkingObjects', objectType: 'Note', property: 'episode'},
        diagnosis: 'string[]',
        visits: {type: 'list', objectType: 'Visit', default: []},                           // cannot be optional
        isClosed: {type: 'bool', default: false},
        primaryPhysician: 'Physician'
    }
};
