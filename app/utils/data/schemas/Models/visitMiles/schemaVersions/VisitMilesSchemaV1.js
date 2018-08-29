import {VisitMiles} from '../VisitMiles';

export const VisitMilesSchemaV1 = {
    name: VisitMiles.getSchemaName(),
    properties: {
        visit: {type: 'linkingObjects', objectType: 'Visit', property: 'visitMiles'},
        odometerStart: {type: 'float?'},
        odometerEnd: {type: 'float?'},
        totalMiles: {type: 'float?'},
        milesComments: {type: 'string?'}
    }
};
