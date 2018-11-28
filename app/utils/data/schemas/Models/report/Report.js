const Realm = require('realm');

export class Report extends Realm.Object {

    static reportStateEnum = {
        CREATED: 'CREATED',
        SUBMIT_QUEUED: 'SUBMIT_QUEUED',
        ACCEPTED: 'ACCEPTED',
    };

    static getSchemaName() {
        return 'Report';
    }

    get reportItemsList() {
        return Object.values(this.reportItems);
    }

}
