import {Episode} from "../Episode";

export const EpisodeSchemaV2 = {
    name: Episode.getSchemaName(),
    primaryKey: 'episodeID',
    properties: {
        episodeID: 'string',
        patient: {type: 'linkingObjects', objectType: 'Patient', property: 'episodes'},     // set automatically
        diagnosis: 'string[]',
        visits: {type: 'list', objectType: 'Visit', default: []},                           // cannot be optional
        isClosed: {type: 'bool', default: false},
        primaryPhysician: {type: 'Physician?', default: null}
    }
};