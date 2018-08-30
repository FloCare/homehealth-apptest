import {NetInfo} from 'react-native';
import {BaseMessagingService} from './BaseMessagingService';
import {pushReportInformation} from '../../../utils/API/ReportAPI';
import {VisitService} from '../../VisitServices/VisitService';

export class ReportMessagingService extends BaseMessagingService {
    static identifier = 'ReportMessagingService';

    getName() {
        return ReportMessagingService.identifier;
    }

    static jobs = {
        publishReportToServer: 'publishReportToServer',
    }

    initialiseWorkers() {
        this.taskQueue.addWorker(ReportMessagingService.jobs.publishReportToServer, this._publishReportToServer.bind(this), {
            concurrency: 3,
            onFailed: (id, payload) => {
                console.log(`Publish report to server Job with id ${id} had an attempt end in failure. Payload:`);
                console.log(payload);
            }
        });
    }

    _getFlatReportPayload(report) {
        const reportItems = Object.values(report.reportItems);
        console.log('report item in flat payload');
        console.log(reportItems);
        return {
            reportID: report.reportID,
            reportItems: reportItems.map(reportItem => ({
                visitID: reportItem.visit.visitID,
                reportItemId: reportItem.reportItemID
            }))
        //    TODO Add total miles check
        };
    }

    _createPublishReportToServerJob(payload) {
        console.log('creating publish to server job');
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log('creating job 2');
            this.taskQueue.createJob(ReportMessagingService.jobs.publishReportToServer, payload, {attempts: 5}, isConnected);
        });
    }

    publishReportToBackend(report) {
        this._createPublishReportToServerJob({
            action: 'CREATE_REPORT',
            report: this._getFlatReportPayload(report)
        });
    }


    async _publishReportToServer(jobID, payload) {
        console.log(`publish job here${payload}`);
        const {action, report} = payload;
        let serverResponse;
        try {
            switch (action) {
                case 'CREATE_REPORT':
                    console.log(JSON.stringify({report}));
                    serverResponse = await pushReportInformation(report);
                    if (serverResponse.ok) {
                        VisitService.getInstance().markReportAccepted(report.reportID);
                    } else {
                        throw new Error('Error sending report to backend');
                    }
                    break;
                default:
                    console.log(`invalid task: ${payload}`);
                    break;
            }
        } catch (e) {
            console.log('error in making server call');
            console.log(payload);
            console.log(e);
            throw e;
        }
    }

}
