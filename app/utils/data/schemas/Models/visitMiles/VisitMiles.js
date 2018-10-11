const Realm = require('realm');

export class VisitMiles extends Realm.Object {

    static getSchemaName() {
        return 'VisitMiles';
    }

    static getMiles(odometerStart, odometerEnd) {
        if (typeof (odometerStart) === 'number' && typeof (odometerEnd) === 'number') {
            return odometerEnd - odometerStart;
        }
        return null;
    }

    static getComputedMilesString(computedMiles) {
        return computedMiles ? `${computedMiles}` : '...';
    }

    static getExtraMilesString(extraMiles) {
        return extraMiles ? `+${extraMiles}` : '';
    }

    get MilesTravelled() {
        if (this.odometerStart || this.odometerEnd) {
            return VisitMiles.getMiles(this.odometerStart, this.odometerEnd);
        }
        if (this.computedMiles) {
            let totalMiles = this.computedMiles;
            totalMiles += this.extraMiles ? this.extraMiles : 0;
            return totalMiles;
        }
        return null;
    }

}
