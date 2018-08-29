import {Report} from '../Report';

export const ReportSchemaV1 = {
    name: Report.getSchemaName(),
    primaryKey: 'reportID',
    properties: {
        reportID: {type: 'string'},
        status: {type: 'string'},
        reportItems: {type: 'linkingObjects', objectType: 'ReportItem', property: 'report'},
    }
};
