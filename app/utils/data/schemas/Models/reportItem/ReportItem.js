const Realm = require('realm');

export class ReportItem extends Realm.Object {

    static getSchemaName() {
        return 'ReportItem';
    }

}
