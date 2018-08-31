const Realm = require('realm');

export class Report extends Realm.Object {

    static reportStateEnum = {
        CREATED: 'CREATED',
        ACCEPTED: 'ACCEPTED',
    }

    static getSchemaName() {
        return 'Report';
    }

    get reportItemsList() {
        return Object.values(this.reportItems);
    }

}
