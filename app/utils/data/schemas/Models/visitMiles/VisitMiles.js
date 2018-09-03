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

    get MilesTravelled() {
        return VisitMiles.getMiles(this.odometerStart, this.odometerEnd);
    }


}
