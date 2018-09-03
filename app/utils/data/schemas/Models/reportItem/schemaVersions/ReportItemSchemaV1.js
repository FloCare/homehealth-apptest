import {ReportItem} from '../ReportItem';

export const ReportItemSchemaV1 = {
    name: ReportItem.getSchemaName(),
    primaryKey: 'reportItemID',
    properties: {
        reportItemID: {type: 'string'},
        reports: {type: 'linkingObjects', objectType: 'Report', property: 'reportItems'}, // only 1 report for report item
        visit: 'Visit',
    }
};
