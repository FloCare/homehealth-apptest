import {ReportItem} from '../ReportItem';

export const ReportItemSchemaV1 = {
    name: ReportItem.getSchemaName(),
    primaryKey: 'reportItemID',
    properties: {
        reportItemID: {type: 'string'},
        report: 'Report',
        visit: 'Visit',
    }
};
