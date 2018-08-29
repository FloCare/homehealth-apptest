const Realm = require('realm');

export class VisitMiles extends Realm.Object {

    static getSchemaName() {
        return 'VisitMiles';
    }

    static getMiles(odometerStart, odometerEnd) {
        if (odometerStart && odometerEnd) {
            return odometerEnd - odometerStart;
        }
        return null;
    }

}
