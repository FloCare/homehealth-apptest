import {VisitMiles} from '../VisitMiles';

export const VisitMilesSchemaV2 = {
    name: VisitMiles.getSchemaName(),
    properties: {
        odometerStart: {type: 'float?'},
        odometerEnd: {type: 'float?'},
        computedMiles: {type: 'float?'},
        extraMiles: {type: 'float?'},
        milesComments: {type: 'string?'}
    }
};
