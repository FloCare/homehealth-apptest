const Realm = require('realm');

export class ReportItem extends Realm.Object {

    static getSchemaName() {
        return 'ReportItem';
    }

    getReport() {
        if (this.reports.length > 0) {
            return this.reports[0];
        }
        return null;
    }

}
