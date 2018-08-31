import {NetInfo} from 'react-native';
import {BaseMessagingService} from './BaseMessagingService';
import {pushReportInformation} from '../../../utils/API/ReportAPI';
import {VisitService} from '../../VisitServices/VisitService';
import {EpisodeMessagingService} from './EpisodeMessagingService';
import {getMessagingServiceInstance} from './MessagingServiceCoordinator';
import { showNotification } from '../NotificationService'
import { generateUUID } from '../../../utils/utils'

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
        const reportItems = report.reportItemsList;
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

    static showReportFailedNotification() {
        const body = 'Sending report failed. Please try again later';
        const notificationID = `${generateUUID()}_${Date.now()}`;
        showNotification(body, {}, notificationID);
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
                    } else if (serverResponse.status === 400) {
                        try {
                            serverResponse.json().then(response => {
                                const missingVisitIDs = response.missingVisitIDs;
                                console.log('missingVisitIDs');
                                console.log(missingVisitIDs);
                                if (missingVisitIDs) {
                                    const visits = VisitService.getInstance().getVisitsByIDs(missingVisitIDs);
                                    getMessagingServiceInstance(EpisodeMessagingService.identifier).publishVisitCreateBulk(visits);
                                 }
                            });
                        } catch (e) {
                            console.log('Failed to parse server failure response');
                        }
                        VisitService.getInstance().deleteReportAndItems(report.reportID);
                        ReportMessagingService.showReportFailedNotification();
                    } else {
                        console.log('server response');
                        console.log(serverResponse);
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
