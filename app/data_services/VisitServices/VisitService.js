import firebase from 'react-native-firebase';
import {
    Patient,
    Visit,
    VisitOrder,
    Place,
    Report,
} from '../../utils/data/schema';
import {arrayToObjectByKey, arrayToObjectListByKey} from '../../utils/collectionUtils';
import {generateUUID, todayMomentInUTCMidnight} from '../../utils/utils';
import {eventNames, parameterValues} from '../../utils/constants';
import {VisitReduxService} from './VisitReduxService';
import {VisitRealmService} from './VisitRealmService';
import {getMessagingServiceInstance} from '../MessagingServices/PubNubMessagingService/MessagingServiceCoordinator';
import {EpisodeMessagingService} from '../MessagingServices/PubNubMessagingService/EpisodeMessagingService';
import {UserDataService} from '../UserDataService';
import {getAllMyVisits, getVisitsByID} from '../../utils/API/VisitAPI';
import {EpisodeDataService} from '../EpisodeDataService';
import {stringToFloat} from '../../utils/parsingUtils';
import {ReportService} from './ReportService';
import {VisitMilesService} from './VisitMilesService';
import {ReportMessagingService} from '../MessagingServices/PubNubMessagingService/ReportMessagingService';
import {getReportDetailsByIds} from '../../utils/API/ReportAPI';

export class VisitService {
    static visitService;

    static initialiseService(floDB, store) {
        VisitService.visitService = new VisitService(floDB, store);
    }

    static getInstance() {
        if (!VisitService.visitService) {
            throw new Error('Visit data service requested before being initialised');
        }

        return VisitService.visitService;
    }

    static getFlatVisit(visit) {
        const isPatientVisit = visit.getPatient() !== undefined;

        // if (!isPatientVisit && !visit.getPlace()) { console.log('break'); console.log(visit.getEpisode()); console.log(visit.getEpisode().patient[0]); }
        const visitMiles = visit.visitMiles;
        return {
            visitID: visit.visitID,
            patientID: isPatientVisit ? visit.getPatient().patientID : null,
            episodeID: isPatientVisit ? visit.episode[0].episodeID : null,
            midnightEpochOfVisit: visit.midnightEpochOfVisit,
            placeID: !isPatientVisit ? visit.getPlace().placeID : null,
            plannedStartTime: visit.plannedStartTime,
            isDone: visit.isDone,
            isPatientVisit,
            visitMiles: {
                odometerStart: visitMiles.odometerStart,
                odometerEnd: visitMiles.odometerEnd,
                totalMiles: visitMiles.totalMiles,
                milesComments: visitMiles.milesComments
            }
        };
    }

    static getFlatVisitMap(visits) {
        return arrayToObjectByKey(visits.map(visit => VisitService.getFlatVisit(visit)), 'visitID');
    }

    constructor(floDB, store) {
        this.floDB = floDB;

        this.visitRealmService = VisitRealmService.initialiseService(floDB);
        this.visitReduxService = VisitReduxService.initialiseService(store);
        this.reportService = ReportService.initialiseService(floDB);
        this.visitMilesService = VisitMilesService.initialiseService(floDB);
    }

    isVisitOwn(visit) {
        return UserDataService.getCurrentUserProps().userID === visit.user.userID;
    }

    getVisitsByEpisodeID(episodeID) {
        if (!episodeID) {
            throw new Error('requested visits for empty episodeID');
        }

        return this.floDB.objects(Visit).filtered('episode.episodeID = $0', episodeID);
    }

    setVisitOrderForDate(orderedVisitID, midnightEpoch) {
        const visitList = this.visitRealmService.saveVisitOrderForDate(orderedVisitID, midnightEpoch);
        this.visitReduxService.updateVisitOrderToReduxIfLive(visitList, midnightEpoch);
    }

    loadVisitsForTheDayToRedux(midnightEpoch) {
        const visitsOfDay = this.visitRealmService.getVisitsOfCurrentUserForDate(midnightEpoch);
        this.visitReduxService.addVisitsToRedux(visitsOfDay);

        const visitOrderOfDay = this.visitRealmService.getVisitOrderForDate(midnightEpoch);
        this.visitReduxService.setVisitOrderInRedux(visitOrderOfDay.visitList);
    }

    filterUserVisits(visits) {
        return this.visitRealmService.selectCurrentUserVisits(visits);
    }

    filterVisitsLessThanDate(visits, date) {
        return this.visitRealmService.filterVisitsLessThanDate(visits, date);
    }

    filterVisitsGreaterThanDate(visits, date) {
        return this.visitRealmService.filterVisitsGreaterThanDate(visits, date);
    }

    filterDoneVisits(visits, doneStatus) {
        return this.visitRealmService.filterDoneVisits(visits, doneStatus);
    }

    sortVisitsByField(visits, field, descending = false) {
        return this.visitRealmService.sortVisitsByField(visits, field, descending);
    }

    toggleVisitDone(visitID) {
        console.log(`${visitID}toggled`);
        firebase.analytics().logEvent(eventNames.VISIT_ACTIONS, {
            type: parameterValues.TOGGLE
        });
        const visit = this.floDB.objectForPrimaryKey(Visit, visitID);

        if (!visit.isDone) {
            this.markVisitDone(visit);
        } else {
            this.markVisitUndone(visit);
        }
        getMessagingServiceInstance(EpisodeMessagingService.identifier).publishVisitUpdate(visit);
    }

    markVisitDone(visit) {
        const newOrderedVisitList = [];
        const currentVisitOrder = this.floDB.objectForPrimaryKey(VisitOrder, visit.midnightEpochOfVisit);

        for (let i = 0; i < currentVisitOrder.visitList.length; i++) {
            if (visit.visitID === currentVisitOrder.visitList[i].visitID) {
                newOrderedVisitList.push(...currentVisitOrder.visitList.slice(0, i));
                if (currentVisitOrder.visitList.length !== i + 1) {
                    newOrderedVisitList.push(...currentVisitOrder.visitList.slice(i + 1, currentVisitOrder.visitList.length));
                }
                newOrderedVisitList.push(currentVisitOrder.visitList[i]);
            }
        }
        this.floDB.write(() => {
            visit.isDone = true;
            currentVisitOrder.visitList = newOrderedVisitList;
        });

        this.visitReduxService.updateVisitToRedux(visit);
        this.visitReduxService.updateVisitOrderToReduxIfLive(currentVisitOrder.visitList, visit.midnightEpochOfVisit);
    }

    //TODO verify correctness
    markVisitUndone(visit) {
        const newOrderedVisitList = [];
        const currentVisitOrder = this.floDB.objectForPrimaryKey(VisitOrder, visit.midnightEpochOfVisit);

        let i;
        for (i = 0; i < currentVisitOrder.visitList.length; i++) {
            if (currentVisitOrder.visitList[i].isDone) {
                newOrderedVisitList.push(...currentVisitOrder.visitList.slice(0, i));
                newOrderedVisitList.push(visit);
                break;
            }
        }

        if (currentVisitOrder.visitList.length !== i + 1) {
            for (let j = i; j < currentVisitOrder.visitList.length; j++) {
                if (visit.visitID === currentVisitOrder.visitList[j].visitID) {
                    newOrderedVisitList.push(...currentVisitOrder.visitList.slice(i, j));
                    if (currentVisitOrder.visitList.length !== j + 1) {
                        newOrderedVisitList.push(...currentVisitOrder.visitList.slice(j + 1, currentVisitOrder.visitList.length));
                    }
                }
            }
        }
        this.floDB.write(() => {
            visit.isDone = false;
            currentVisitOrder.visitList = newOrderedVisitList;
        });

        this.visitReduxService.updateVisitToRedux(visit);
        this.visitReduxService.updateVisitOrderToReduxIfLive(currentVisitOrder.visitList, visit.midnightEpochOfVisit);
    }

    fetchAndSaveMyVisitsFromServer() {
        return getAllMyVisits().then(visits => {
            const reportIDs = visits.map(visit => visit.reportID).filter(reportID => reportID);
            const uniqueReportIDs = [...new Set(reportIDs)];
            getReportDetailsByIds(uniqueReportIDs).then(reportsJSONData => {
                const visitByMidnight = arrayToObjectListByKey(visits, 'midnightEpochOfVisit');
                Object.keys(visitByMidnight).forEach(midnightEpochOfVisit => {
                    const daysVisits = visitByMidnight[midnightEpochOfVisit].map(visit => this.saveVisitToRealm(visit, false)).filter(visit => visit);
                    if (daysVisits && daysVisits.length > 0) {
                        const visitOrder = this.visitRealmService.getVisitOrderForDate(Number(midnightEpochOfVisit));
                        this.floDB.write(() => {
                            visitOrder.visitList = daysVisits;
                            console.log(`midnight ${midnightEpochOfVisit}`);
                            console.log(this.visitRealmService.getVisitOrderForDate(Number(midnightEpochOfVisit)));
                        });
                    }
                });
                this.floDB.write(() => {
                    reportsJSONData.forEach(reportData => {
                        const reportObject = this.reportService.createReport(reportData.id, Report.reportStateEnum.ACCEPTED);
                        reportData.reportItems.forEach(
                            reportItemData => (this.reportService.createReportItem(
                                reportItemData.reportItemId,
                                reportObject,
                                this.visitRealmService.getVisitByID(reportItemData.visitID)))
                        );
                    });
                });
            });
        }).catch(error => {
            console.log('error in fetching all preexisting visits');
            console.log(error);
        });
    }

    fetchAndSaveVisitsByID(visitIDs, update) {
        return getVisitsByID(visitIDs).then(respJson => {
            if (respJson.success && respJson.success.length === visitIDs.length) {
                const visits = [];
                respJson.success.forEach(visitJson => {
                    console.log(visitJson);
                    visits.push(this.saveVisitToRealm(visitJson, update));
                });
                return visits;
            }
            throw respJson;
        }).catch(error => {
            console.log(`error occured in trying to fetch and save visits ${visitIDs}`);
            console.log(error);
            throw error;
        });
    }

    saveVisitToRealm(visitJson, update = false) {
        if (!EpisodeDataService.getInstance().getEpisodeByID(visitJson.episodeID)) {
            console.log(`skipping saveVisitToRealm with the following episodeID because episode doesnt exist: ${visitJson.episodeID}`);
            return;
        }
        let visit;
        if (visitJson.plannedStartTime) {
            visitJson.plannedStartTime = new Date(visitJson.plannedStartTime);
        }
        const visitMiles = visitJson.visitMiles;
        const visitMilesData = {
            odometerStart: visitMiles ? visitMiles.odometerStart : null,
            odometerEnd: visitMiles ? visitMiles.odometerEnd : null,
            totalMiles: visitMiles ? visitMiles.totalMiles : null,
            milesComments: visitMiles ? visitMiles.milesComments : null,
        };
        this.floDB.write(() => {
            const user = UserDataService.getInstance().getUserByID(visitJson.userID);
            if (!user) throw new Error(`no user found for visit being saved: ${visitJson.userID}`);
            visit = this.floDB.create(Visit, visitJson, update);
            this.visitRealmService.createVisitMilesForVisit(visit, visitMilesData);
            visit.user = user;
        });
        // console.log('visitsaved');
        if (!update) {
            EpisodeDataService.getInstance().saveVisitToEpisodeID(visit, visitJson.episodeID);
        }
        return visit;
    }

    createNewVisits(visitSubjects, midnightEpoch) {
        const newVisits = [];
        const visitMilesData = {
            odometerStart: null,
            odometerEnd: null,
            totalMiles: null,
            milesComments: null
        };
        this.floDB.write(() => {
            for (const visitSubject of visitSubjects) {
                const visit = this.floDB.create(Visit, {
                    visitID: generateUUID(),
                    user: UserDataService.getInstance().getUserByID(UserDataService.getCurrentUserProps().userID),
                    midnightEpochOfVisit: midnightEpoch
                });
                this.visitRealmService.createVisitMilesForVisit(visit, visitMilesData);
                newVisits.push(visit);
                if (visitSubject instanceof Patient) {
                    visitSubject.episodes[0].visits.push(visit);
                } else visitSubject.visits.push(visit);
            }
        });

        //TODO this is just a stub
        newVisits.forEach(visit => {
            getMessagingServiceInstance(EpisodeMessagingService.identifier).publishVisitCreate(visit);
        });

        const newVisitOrder = this.visitRealmService.insertNewVisits(newVisits, midnightEpoch);
        if (midnightEpoch === this.visitReduxService.getActiveDate()) {
            this.visitReduxService.addVisitsToRedux(newVisits);
            this.visitReduxService.setVisitOrderInRedux(newVisitOrder);
        }
    }

    deleteVisitByID(visitID) {
        // Visit order doesn't need to be explicitly deleted
        const visit = this.visitRealmService.getVisitByID(visitID);
        if (!visit) {
            console.log(`attempting to delete visitID: ${visitID}, that doesnt exist`);
            return;
        }
        const visitTimeEpoch = visit.midnightEpochOfVisit;

        getMessagingServiceInstance(EpisodeMessagingService.identifier).publishVisitDeletes([visit]);

        this.visitRealmService.deleteVisitByObject(visit);
        this.visitReduxService.updateVisitOrderToReduxIfLive(this.floDB.objectForPrimaryKey(VisitOrder, visitTimeEpoch).visitList, visitTimeEpoch);
        this.visitReduxService.deleteVisitsFromRedux([visitID]);
    }

    getAllFutureVisitsForSubject(subject) {
        const today = todayMomentInUTCMidnight();

        if (subject instanceof Patient) {
            return subject.getFirstEpisode().visits.filtered(`midnightEpochOfVisit >= ${today}`);
        } else if (subject instanceof Place) {
            return subject.visits.filtered(`midnightEpochOfVisit >= ${today}`);
        }
        throw new Error('requested visits for unrecognised entity');
    }

    getSubmittedMilesLogVisits() {
        const userVisits = this.visitRealmService.getCurrentUserVisits();
        const reportedVisits = this.reportService.filterReportedVisits(userVisits);
        return this.sortVisitsByField(reportedVisits, 'midnightEpochOfVisit');
    }

    getActiveMilesLogVisits() {
        const doneUserVisits = this.visitRealmService.getDoneUserVisits();
        const milesActiveVisits = this.visitMilesService.filterMilesInformationCompleteVisits(doneUserVisits);
        const nonReportedVisits = this.reportService.filterNonReportedVisits(milesActiveVisits);
        return this.sortVisitsByField(nonReportedVisits, 'midnightEpochOfVisit', true);
    }

    //only use for other user's unassign
    deleteVisitsOfEpisodeByUserID(episodeID, userID) {
        console.log('Deleting visits from realm');
        //TODO delete start point shouldnt be determined by when the user happens to run the code
        const today = todayMomentInUTCMidnight();
        const allFutureVisitsForEpisode = EpisodeDataService.getInstance().getEpisodeByID(episodeID).visits.filtered(`midnightEpochOfVisit >= ${today}`);
        const visits = this.visitRealmService.filterVisitsByUserID(allFutureVisitsForEpisode, userID);
        this.floDB.write(() => {
            this.floDB.delete(visits);
        });
    }

    // Should be a part of a write transaction
    deleteVisitsForSubject(subject) {
        console.log('Deleting visits from realm');
        const today = todayMomentInUTCMidnight();

        // Todo: Check if this works
        const visits = this.getAllFutureVisitsForSubject(subject);
        const visitOrders = this.floDB.objects(VisitOrder.schema.name).filtered(`midnightEpoch >= ${today}`);

        // getMessagingServiceInstance(EpisodeMessagingService.identifier).publishVisitDeletes(visits);

        // TODO: Only iterate over dates where visit for that patient/stop is actually present
        for (let i = 0; i < visitOrders.length; i++) {
            const visitList = [];
            for (let j = 0; j < visitOrders[i].visitList.length; j++) {
                const visit = visitOrders[i].visitList[j];
                if (!(visit.isSubjectArchived())) {
                    visitList.push(visit);
                }
            }
            this.floDB.write(() => {
                visitOrders[i].visitList = visitList;
            });
        }
        const visitIDs = visits.map((visit) => visit.visitID);
        this.floDB.write(() => {
            this.floDB.delete(visits);
        });

        if (visitOrders) {
            for (let i = 0; i < visitOrders.length; i++) {
                this.visitReduxService.updateVisitOrderToReduxIfLive(visitOrders[i].visitList, visitOrders[i].midnightEpoch);
            }
        }

        if (visits) {
            this.visitReduxService.deleteVisitsFromRedux(visitIDs);
        }
    }

    updateVisitStartTimeByID(visitID, startTime) {
        this.visitRealmService.updateVisitStartTimeByID(visitID, startTime);
        this.visitReduxService.updateVisitPropertyInRedux(visitID, 'plannedStartTime', startTime);

        getMessagingServiceInstance(EpisodeMessagingService.identifier).publishVisitUpdate(this.visitRealmService.getVisitByID(visitID));
    }

    updateMilesDataByVisitID(visitID, odometerStart, odometerEnd, totalMiles, milesComments) {
        const visit = this.visitRealmService.getVisitByID(visitID);
        this.visitRealmService.updateMilesDataByVisitObject(
            visit,
            stringToFloat(odometerStart),
            stringToFloat(odometerEnd),
            stringToFloat(totalMiles),
            milesComments
        );

        this.visitReduxService.updateVisitToRedux(visit);
        getMessagingServiceInstance(EpisodeMessagingService.identifier).publishVisitUpdate(visit);
    }

    generateReportAndSubmitVisits = (visitIDs) => {
        const visits = this.visitRealmService.getVisitsByIDs(visitIDs);
        const report = this.reportService.generateReportForVisits(visits);
        getMessagingServiceInstance(ReportMessagingService.identifier).publishReportToBackend(report);
    }

    markReportAccepted = (reportID) => {
        this.reportService.updateStatusByReportID(reportID, Report.reportStateEnum.ACCEPTED);
    }

}
