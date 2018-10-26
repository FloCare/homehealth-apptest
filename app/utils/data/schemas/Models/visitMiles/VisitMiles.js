import {milesRenderString} from '../../../../renderFormatUtils';

const Realm = require('realm');

export class VisitMiles extends Realm.Object {

    static getSchemaName() {
        return 'VisitMiles';
    }

    static getComputedMilesString(computedMiles) {
        return computedMiles ? `${milesRenderString(computedMiles)}` : '__';
    }

    get IsMilesInformationPresent() {
        return (this.computedMiles !== null && this.computedMiles !== undefined);
    }

    get MilesTravelled() {
        let totalMiles = this.computedMiles;
        totalMiles += this.extraMiles ? this.extraMiles : 0;
        return totalMiles;
    }

}
