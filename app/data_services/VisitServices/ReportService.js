import {Report, ReportItem} from '../../utils/data/schema';
import {generateUUID} from '../../utils/utils';

// The day I will be a 1000 years old
const TIME_INF = 32384687400000;

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

    filterNonReportedVisits = (visits) => visits.filtered('reportItems.@size == 0');

    filterReportedVisits = (visits) => visits.filtered('reportItems.@size == 1');

    getReports = () => (
        // TODO sort by created at date
        this.floDB.objects(Report)//.filtered(`status == "${Report.reportStateEnum.ACCEPTED}" OR status == "${Report.reportStateEnum.CREATED}"`)
    );

    getReportDateWiseSummary = (report) => {
        const status = report.status;
        const visits = report.reportItems.map(reportItem => reportItem.visit);
        const dateWiseSummary = {};
        let minDate = TIME_INF;
        let maxDate = 0;
        visits.forEach(visit => {
            const date = visit.midnightEpochOfVisit;
            if (date in dateWiseSummary) {
                const dateSummary = dateWiseSummary[date];
                dateSummary.computedMiles += visit.visitMiles.computedMiles ? visit.visitMiles.computedMiles : 0;
                dateSummary.extraMiles += visit.visitMiles.extraMiles ? visit.visitMiles.extraMiles : 0;
                dateSummary.nVisits += 1;
            } else {
                dateWiseSummary[date] = {
                    computedMiles: visit.visitMiles.computedMiles ? visit.visitMiles.computedMiles : 0,
                    extraMiles: visit.visitMiles.extraMiles ? visit.visitMiles.extraMiles : 0,
                    nVisits: 0
                };
            }
            if (visit.midnightEpochOfVisit > maxDate) {
                maxDate = visit.midnightEpochOfVisit;
            }
            if (visit.midnightEpochOfVisit < minDate) {
                minDate = visit.midnightEpochOfVisit;
            }
        });
        return {
            status,
            minDate,
            maxDate,
            dateWiseSummary
        };
    };


    createReport(reportID, status) {
        return this.floDB.create(Report, {
            reportID,
            status
        });
    }

    createReportItem(reportItemID, visit) {
        return this.floDB.create(ReportItem, {
            reportItemID,
            visit
        });
    }

    getReportByID(reportID) {
        return this.floDB.objectForPrimaryKey(Report, reportID);
    }

    deleteReportAndItemsByReportID(reportID) {
        const report = this.getReportByID(reportID);
        const reportItemsList = report.reportItems;
        this.floDB.write(() => {
            this.floDB.delete(reportItemsList);
            this.floDB.delete(report);
        });
    }

    deleteReportItemByObject(reportItem) {
        this.floDB.delete(reportItem);
    }

    generateReportForVisits = (visits) => {
        let reportObject = null;
        this.floDB.write(() => {
            const report = this.createReport(generateUUID(), Report.reportStateEnum.CREATED);
            report.reportItems = visits.map(visit => this.createReportItem(generateUUID(), visit));
            reportObject = report;
        });
        return reportObject;
    };

    updateStatusByReportID = (reportID, status) => {
        const report = this.floDB.objectForPrimaryKey(Report, reportID);
        this.floDB.write(() => {
            report.status = status;
        });
    }

}
