import {Report, ReportItem} from '../../utils/data/schema';
import {generateUUID} from '../../utils/utils';

export class ReportService {
    static reportService;

    static initialiseService(floDB) {
        ReportService.reportService = new ReportService(floDB);
        return ReportService.reportService;
    }

    static getInstance() {
        if (!ReportService.reportService) {
            throw new Error('Report service requested before being initialised');
        }
        return ReportService.reportService;
    }

    constructor(floDB) {
        this.floDB = floDB;
    }

    filterNonReportedVisits = (visits) => {
        return visits.filtered('reportItems.@size == 0');
    }

    filterReportedVisits = (visits) => {
        return visits.filtered('reportItems.@size == 1');
    }

    createReport(reportID, status) {
        return this.floDB.create(Report, {
            reportID,
            status
        });
    }

    createReportItem(reportItemID, report, visit) {
        return this.floDB.create(ReportItem, {
            reportItemID,
            report,
            visit
        });
    }

    deleteReportItemByObject(reportItem) {
        this.floDB.delete(reportItem);
    }

    generateReportForVisits = (visits) => {
        let reportObject = null;
        this.floDB.write(() => {
            const report = this.createReport(generateUUID(), Report.reportStateEnum.CREATED);
            visits.forEach(visit => {
                    this.createReportItem(generateUUID(), report, visit);
                }
            );
            reportObject = report;
        });
        return reportObject;
    }

    updateStatusByReportID = (reportID, status) => {
        const report = this.floDB.objectForPrimaryKey(Report, reportID);
        this.floDB.write(() => {
            report.status = status;
        });
    }

}
