import {Visit} from '../Visit';

export const VisitSchemaV3 = {
    name: Visit.getSchemaName(),
    primaryKey: 'visitID',
    properties: {
        visitID: 'string',
        user: 'User',
        episode: {type: 'linkingObjects', objectType: 'Episode', property: 'visits'},       // set automatically
        place: {type: 'linkingObjects', objectType: 'Place', property: 'visits'},
        midnightEpochOfVisit: 'int',
        plannedStartTime: 'date?',
        isDone: {type: 'bool', default: false},
        timeOfCompletion: 'int?',
        isDeleted: {type: 'bool', default: false},
        visitMiles: 'VisitMiles',
        reportItems: {type: 'linkingObjects', objectType: 'ReportItem', property: 'visit'},
    }
};
