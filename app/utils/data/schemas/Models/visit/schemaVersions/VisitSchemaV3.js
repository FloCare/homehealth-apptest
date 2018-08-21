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

        // miles related information
        odometerStart: {type: 'float?'},
        odometerEnd: {type: 'float?'},
        totalMiles: {type: 'float?'},
        milesComments: {type: 'string?'}
    }
};
