import firebase from 'react-native-firebase';
import {Alert} from 'react-native';
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
import {PlaceDataService} from '../PlaceDataService';
import {getProcessedDataForOrderedList} from '../../utils/MapUtils';

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
        const flatVisit = {
            visitID: visit.visitID,
            patientID: isPatientVisit ? visit.getPatient().patientID : null,
            episodeID: isPatientVisit ? visit.episode[0].episodeID : null,
            midnightEpochOfVisit: visit.midnightEpochOfVisit,
            placeID: !isPatientVisit ? visit.getPlace().placeID : null,
            plannedStartTime: visit.plannedStartTime,
            isDone: visit.isDone,
            isPatientVisit
        };
        if (VisitService.isVisitOwn(visit)) {
            const visitMiles = visit.visitMiles;
            flatVisit.visitMiles = {
                odometerStart: visitMiles.odometerStart,
                odometerEnd: visitMiles.odometerEnd,
                totalMiles: visitMiles.totalMiles,
                milesComments: visitMiles.milesComments
            };
        }
        return flatVisit;
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

    static isVisitOwn(visit) {
        return UserDataService.getCurrentUserProps().userID === visit.user.userID;
    }

    async updateMilesDataForVisitList(visitList) {
        const timer = setTimeout(() => this.clearAllMilesForVisitList(visitList), 1500);

        const reorderedVisitList = [...visitList.filter(visit => visit.isDone), ...visitList.filter(visit => !visit.isDone)];
        const coordinatesList = reorderedVisitList.map(visit => ({latitude: visit.getAddress().latitude, longitude: visit.getAddress().longitude}));

        if (reorderedVisitList.length >= 2) {
            const mapData = await getProcessedDataForOrderedList(coordinatesList);
            console.log('new map data');
            console.log(mapData.distances);

            clearTimeout(timer);
            this.floDB.write(() => {
                reorderedVisitList.forEach((visit, index) => {
                    if (index === 0) { return; }
                    visit.visitMiles.totalMiles = parseFloat(mapData.distances[index - 1]);
                });
            });
        } else {
            clearTimeout(timer);
        }
    }

    clearAllMilesForVisitList(visitList) {
        // Alert.alert('clear visits');
        this.floDB.write(() => {
            visitList.forEach(visit => {
                visit.visitMiles.totalMiles = null;
                visit.visitMiles.odometerStart = null;
                visit.visitMiles.odometerEnd = null;
            });
        });
        this.visitReduxService.updateVisitsToRedux(visitList);
    }

    getVisitsByIDs(visitIDs) {
        return this.visitRealmService.getVisitsByIDs(visitIDs);
    }

    getVisitsByEpisodeID(episodeID) {
        if (!episodeID) {
            throw new Error('requested visits for empty episodeID');
        }

        return this.floDB.objects(Visit).filtered('episode.episodeID = $0', episodeID);
    }

    setVisitOrderForDate(orderedVisitID, midnightEpoch) {
        const visitList = this.visitRealmService.saveVisitOrderForDate(orderedVisitID, midnightEpoch);
        this.updateMilesDataForVisitList(visitList);
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
        this.updateMilesDataForVisitList(newOrderedVisitList);


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

        this.updateMilesDataForVisitList(newOrderedVisitList);
        this.visitReduxService.updateVisitToRedux(visit);
        this.visitReduxService.updateVisitOrderToReduxIfLive(currentVisitOrder.visitList, visit.midnightEpochOfVisit);
    }

    fetchAndSaveMyVisitsFromServer() {
        return getAllMyVisits().then(visits => {
            const reportIDs = visits.map(visit => visit.reportID).filter(reportID => reportID);
            const uniqueReportIDs = [...new Set(reportIDs)];
            return getReportDetailsByIds(uniqueReportIDs).then(reportsJSONData => {
                const visitByMidnight = arrayToObjectListByKey(visits, 'midnightEpochOfVisit');
                Object.keys(visitByMidnight).forEach(midnightEpochOfVisit => {
                    const daysVisits = visitByMidnight[midnightEpochOfVisit].map(visit => this.saveVisitToRealm(visit, false)).filter(visit => visit);
                    const daysVisitsSortedByDone = daysVisits.sort((visit1, visit2) => visit1.isDone - visit2.isDone);
                    if (daysVisitsSortedByDone && daysVisitsSortedByDone.length > 0) {
                        const visitOrder = this.visitRealmService.getVisitOrderForDate(Number(midnightEpochOfVisit));
                        this.floDB.write(() => {
                            visitOrder.visitList = daysVisitsSortedByDone;
                        });
                        //TODO put this shit here too
                    }
                });
                this.floDB.write(() => {
                    reportsJSONData.forEach(reportData => {
                        const reportObject = this.reportService.createReport(reportData.id, Report.reportStateEnum.ACCEPTED);
                        reportObject.reportItems = reportData.reportItems.map(
                            reportItemData => (this.reportService.createReportItem(
                                reportItemData.reportItemId,
                                this.visitRealmService.getVisitByID(reportItemData.visitID
                            )))
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
        const episodeID = visitJson.episodeID;
        const placeID = visitJson.placeID;
        let place = null;
        let episode = null;
        if (placeID) {
            place = PlaceDataService.getInstance().getPlaceByID(placeID);
        }
        if (episodeID) {
            episode = EpisodeDataService.getInstance().getEpisodeByID(episodeID);
        }
        if (!episode && !place) {
            console.log(`skipping saveVisitToRealm - episodeID -: ${episodeID} -- placeID: ${placeID}`);
            return;
        }
        let visit;
        if (visitJson.plannedStartTime) {
            visitJson.plannedStartTime = new Date(visitJson.plannedStartTime);
        }
        this.floDB.write(() => {
            const user = UserDataService.getInstance().getUserByID(visitJson.userID);
            if (!user) throw new Error(`no user found for visit being saved: ${visitJson.userID}`);
            visit = this.floDB.create(Visit, visitJson, update);
            visit.user = user;
            if (VisitService.isVisitOwn(visit)) {
                const visitMiles = visitJson.visitMiles;
                const visitMilesData = {
                    odometerStart: visitMiles ? visitMiles.odometerStart : null,
                    odometerEnd: visitMiles ? visitMiles.odometerEnd : null,
                    totalMiles: visitMiles ? visitMiles.totalMiles : null,
                    milesComments: visitMiles ? visitMiles.milesComments : null,
                };
                this.visitMilesService.createVisitMilesForVisit(visit, visitMilesData);
            }
            if (!update) {
                if (episode) {
                    EpisodeDataService.getInstance().saveVisitToEpisodeID(visit, visitJson.episodeID);
                } else if (place) {
                    place.visits.push(visit);
                }
            }
        });
        // console.log('visitsaved');
        return visit;
    }

    createNewVisits(visitSubjects, midnightEpoch) {
        const newVisits = [];
        this.floDB.write(() => {
            for (const visitSubject of visitSubjects) {
                const visit = this.floDB.create(Visit, {
                    visitID: generateUUID(),
                    user: UserDataService.getInstance().getUserByID(UserDataService.getCurrentUserProps().userID),
                    midnightEpochOfVisit: midnightEpoch
                });
                if (VisitService.isVisitOwn(visit)) {
                    const visitMilesData = {
                        odometerStart: null,
                        odometerEnd: null,
                        totalMiles: null,
                        milesComments: null
                    };
                    this.visitMilesService.createVisitMilesForVisit(visit, visitMilesData);
                }
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

        const newVisitList = this.visitRealmService.insertNewVisits(newVisits, midnightEpoch);
        this.updateMilesDataForVisitList(newVisitList);

        if (midnightEpoch === this.visitReduxService.getActiveDate()) {
            this.visitReduxService.addVisitsToRedux(newVisits);
            this.visitReduxService.setVisitOrderInRedux(newVisitList);
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
        this.floDB.write(() => {
            if (VisitService.isVisitOwn(visit)) {
                this.visitMilesService.deleteVisitMilesByObject(visit.visitMiles);
            }
            const reportItem = visit.getReportItem();
            if (reportItem) {
                this.reportService.deleteReportItemByObject(reportItem);
            }
            this.visitRealmService.deleteVisitByObject(visit);
        });

        const newVisitOrder = this.floDB.objectForPrimaryKey(VisitOrder, visitTimeEpoch);
        this.updateMilesDataForVisitList(newVisitOrder.visitList);

        this.visitReduxService.updateVisitOrderToReduxIfLive(newVisitOrder.visitList, visitTimeEpoch);
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

    subscribeToSubmittedVisits(callbackFunction) {
        const userVisits = this.visitRealmService.getCurrentUserVisits();
        const reportedVisits = this.reportService.filterReportedVisits(userVisits);
        const visitsResult = this.sortVisitsByField(reportedVisits, 'midnightEpochOfVisit', true);
        const realmListener = (visitObjects) => { callbackFunction(visitObjects); };
        visitsResult.addListener(realmListener);
        return {
            currentData: visitsResult,
            unsubscribe: () => visitsResult.removeListener(realmListener),
        };
    }

    subscribeToActiveVisits(callbackFunction) {
        const doneUserVisits = this.visitRealmService.getDoneUserVisits();
        const milesActiveVisits = this.visitMilesService.filterMilesInformationCompleteVisits(doneUserVisits);
        const nonReportedVisits = this.reportService.filterNonReportedVisits(milesActiveVisits);
        const visitsResult = this.sortVisitsByField(nonReportedVisits, 'midnightEpochOfVisit', true);
        const realmListener = (visitObjects) => { callbackFunction(visitObjects); };
        visitsResult.addListener(realmListener);
        return {
            currentData: visitsResult,
            unsubscribe: () => visitsResult.removeListener(realmListener),
        };
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
                //TODO do something here
            });
        }
        const visitIDs = visits.map((visit) => visit.visitID);
        this.floDB.write(() => {
            visits.forEach(visit => {
                if (VisitService.isVisitOwn(visit)) {
                    this.visitMilesService.deleteVisitMilesByObject(visit.visitMiles);
                }
                const reportItem = visit.getReportItem();
                if (reportItem) {
                    this.reportService.deleteReportItemByObject(reportItem);
                }
            });
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
        //TODO Remove this. As others don't care about this.
        getMessagingServiceInstance(EpisodeMessagingService.identifier).publishVisitUpdate(visit);
    }

    generateReportAndSubmitVisits = (visitIDs) => {
        const visits = this.getVisitsByIDs(visitIDs);
        const report = this.reportService.generateReportForVisits(visits);
        const totalMiles = visits.reduce((totalMilesInReport, visit) => (totalMilesInReport + visit.visitMiles.MilesTravelled), 0);
        firebase.analytics().logEvent(eventNames.SEND_REPORT, {
            VALUE: totalMiles,
            NO_OF_VISITS: visits.length
        });
        getMessagingServiceInstance(ReportMessagingService.identifier).publishReportToBackend(report);
    }

    markReportAccepted = (reportID) => {
        this.reportService.updateStatusByReportID(reportID, Report.reportStateEnum.ACCEPTED);
    }

    deleteReportAndItems = (reportID) => {
        this.reportService.deleteReportAndItemsByReportID(reportID);
    }

}
