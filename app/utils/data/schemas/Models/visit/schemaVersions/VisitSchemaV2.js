import {Visit} from '../Visit';

export const VisitSchemaV2 = {
    name: Visit.getSchemaName(),
    primaryKey: 'visitID',
    properties: {
        visitID: 'string',
        userID: 'string',
        episode: {type: 'linkingObjects', objectType: 'Episode', property: 'visits'},       // set automatically
        place: {type: 'linkingObjects', objectType: 'Place', property: 'visits'},
        midnightEpochOfVisit: 'int',
        plannedStartTime: 'date?',
        isDone: {type: 'bool', default: false},
        timeOfCompletion: 'int?',
        isDeleted: {type: 'bool', default: false}
    }
};
