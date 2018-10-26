import {NetInfo} from 'react-native';
import firebase from 'react-native-firebase';
import {BaseMessagingService} from './BaseMessagingService';
import {pushReportInformation} from '../../../utils/API/ReportAPI';
import {VisitService} from '../../VisitServices/VisitService';
import {EpisodeMessagingService} from './EpisodeMessagingService';
import {getMessagingServiceInstance} from './MessagingServiceCoordinator';
import {showNotification} from '../NotificationService';
import {generateUUID} from '../../../utils/utils';
import {eventNames, parameterValues} from '../../../utils/constants';
import {Report} from '../../../utils/data/schema';
import {ReportService} from '../../VisitServices/ReportService';
import {updateVisits} from '../../../utils/API/VisitAPI';
import {PatientDataService} from '../../PatientDataService';

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
                this.handleReportFailure(payload.reportPayload.reportID);
                ReportMessagingService.showReportFailedNotification();
            }
        });
    }

    handleReportFailure = (reportID) => {
        VisitService.getInstance().updateReportStatus(reportID, Report.reportStateEnum.CREATED);
    };

    _getReportDetailsPayload(report) {
        const reportItems = report.reportItems;
        const visits = reportItems.map(reportItem => reportItem.visit);
        const totalMiles = visits.reduce((totalMilesInReport, visit) => (totalMilesInReport + visit.visitMiles.MilesTravelled), 0);
        return {
            reportID: report.reportID,
            reportItems: reportItems.map(reportItem => ({
                visitID: reportItem.visit.visitID,
                reportItemId: reportItem.reportItemID
            })),
            totalMiles
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
            reportPayload: this._getReportDetailsPayload(report)
        });
    }

    static showReportFailedNotification() {
        const body = 'Sending report failed. Please try again later';
        const notificationID = `${generateUUID()}_${Date.now()}`;
        showNotification(body, {}, notificationID);
    }

    async syncVisitsForReport(reportID) {
        const report = ReportService.getInstance().getReportByID(reportID);
        const visits = report.reportItems.map(reportItem => reportItem.visit);
        const visitsPayload = visits.map(visit => EpisodeMessagingService.getFlatVisitPayload(visit));
        await updateVisits(visitsPayload);
    }

    async _publishReportToServer(jobID, payload) {
        console.log('publish report to server job here');
        console.log(payload);
        const {action, reportPayload} = payload;
        let serverResponse;
        try {
            switch (action) {
                case 'CREATE_REPORT':
                    console.log(JSON.stringify({reportPayload}));
                    await this.syncVisitsForReport(reportPayload.reportID);
                    serverResponse = await pushReportInformation(reportPayload);
                    if (serverResponse.ok) {
                        console.log('marking reportPayload accepted');
                        VisitService.getInstance().updateReportStatus(reportPayload.reportID, Report.reportStateEnum.ACCEPTED);
                        firebase.analytics().logEvent(eventNames.SEND_REPORT_RESPONSE, {
                            type: parameterValues.SUCCESS
                        });
                    } else if (serverResponse.status === 400) {
                        try {
                            serverResponse.json().then(async response => {
                                console.log('server response');
                                console.log(response);
                                const missingVisitIDs = response.missingVisitIDs;
                                if (missingVisitIDs) {
                                    const visits = VisitService.getInstance().getVisitsByIDs(missingVisitIDs);
                                    const patients = visits.map(visit => visit.getPatient()).filter(patient => patient);
                                    //TODO This should not be required - Remove this after https://flocare.atlassian.net/browse/FC-114
                                    await PatientDataService.getInstance().syncPatientsToServer(patients);
                                    getMessagingServiceInstance(EpisodeMessagingService.identifier).publishVisitCreateBulk(visits);
                                 }
                            });
                        } catch (e) {
                            console.log(e);
                            console.log('Failed to parse server failure response');
                        }
                        this.handleReportFailure(reportPayload.reportID);
                        ReportMessagingService.showReportFailedNotification();
                        firebase.analytics().logEvent(eventNames.SEND_REPORT_RESPONSE, {
                            type: parameterValues.FAILURE
                        });
                    } else {
                        console.log('server response');
                        console.log(serverResponse);
                        firebase.analytics().logEvent(eventNames.SEND_REPORT_RESPONSE, {
                            type: parameterValues.FAILURE
                        });
                        throw new Error('Error sending reportPayload to backend');
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
