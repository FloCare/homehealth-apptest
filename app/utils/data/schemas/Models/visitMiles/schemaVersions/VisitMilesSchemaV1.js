import {VisitMiles} from '../VisitMiles';

export const VisitMilesSchemaV1 = {
    name: VisitMiles.getSchemaName(),
    properties: {
        odometerStart: {type: 'float?'},
        odometerEnd: {type: 'float?'},
        totalMiles: {type: 'float?'},
        milesComments: {type: 'string?'}
    }
};
