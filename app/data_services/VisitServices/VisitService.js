import firebase from 'react-native-firebase';
import {Patient, Visit, VisitOrder, Place} from '../../utils/data/schema';
import {arrayToObjectByKey} from '../../utils/collectionUtils';
import {generateUUID, todayMomentInUTCMidnight} from '../../utils/utils';
import {eventNames, parameterValues} from '../../utils/constants';
import {VisitReduxService} from './VisitReduxService';
import {VisitRealmService} from './VisitRealmService';
import {MessagingServiceCoordinator} from '../MessagingServices/PubNubMessagingService/MessagingServiceCoordinator';
import {VisitMessagingService} from '../MessagingServices/PubNubMessagingService/VisitMessagingService';
import {UserDataService} from '../UserDataService';

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

        return {
            visitID: visit.visitID,
            patientID: isPatientVisit ? visit.getPatient().patientID : null,
            episodeID: isPatientVisit ? visit.episode[0].episodeID : null,
            midnightEpochOfVisit: visit.midnightEpochOfVisit,
            placeID: !isPatientVisit ? visit.getPlace().placeID : null,
            plannedStartTime: visit.plannedStartTime,
            isDone: visit.isDone,
            isPatientVisit
        };
    }

    static getFlatVisitMap(visits) {
        return arrayToObjectByKey(visits.map(visit => VisitService.getFlatVisit(visit)), 'visitID');
    }

    constructor(floDB, store) {
        this.floDB = floDB;

        this.visitRealmService = VisitRealmService.initialiseService(floDB);
        this.visitReduxService = VisitReduxService.initialiseService(store);
    }

    getVisitByID(visitID) {
        return this.floDB.objectForPrimaryKey(Visit, visitID);
    }

    isVisitOwn(visit) {
        return UserDataService.getCurrentUserProps().userID === visit.user.userID;
    }

    getVisitsByEpisodeID(episodeID) {
        if (!episodeID) { throw new Error('requested visits for empty episodeID'); }

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
        return this.visitRealmService.filterUserVisits(visits);
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

    fetchAndSaveVisitsByID(visitIDs) {
        //TODO make calls to the server here, some logic can be borrowed from createNewVisits but mostly needs modification
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    fetchAndEditVisitsByID(visitIDs) {
        //TODO make calls to the server here, some logic can be borrowed from createNewVisits but mostly needs modification
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    deleteVisitsByID(visitIDs) {
        //TODO delete these visits, ensure own visits are filtered out
        return new Promise((resolve, reject) => {
            resolve();
        });
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
                newVisits.push(visit);
                if (visitSubject instanceof Patient) { visitSubject.episodes[0].visits.push(visit); } else visitSubject.visits.push(visit);
            }
        });

        //TODO this is just a stub
        newVisits.forEach(visit => {
            MessagingServiceCoordinator.getInstance().getMessagingServiceInstance(VisitMessagingService).publishVisitCreate(visit);
        });

        // Logging the firebase event upon visits being added
        firebase.analytics().logEvent(eventNames.ADD_VISIT, {
            VALUE: newVisits.length
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
        const visitTimeEpoch = visit.midnightEpochOfVisit;
        this.visitRealmService.deleteVisitByObject(visit);
        this.visitReduxService.setVisitOrderInRedux(this.floDB.objectForPrimaryKey(VisitOrder, visitTimeEpoch).visitList);
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

    // Should be a part of a write transaction
    deleteVisitsForSubject(subject) {
        console.log('Deleting visits from realm');
        const today = todayMomentInUTCMidnight();

        // Todo: Check if this works
        const visits = this.getAllFutureVisitsForSubject(subject);
        const visitOrders = this.floDB.objects(VisitOrder.schema.name).filtered(`midnightEpoch >= ${today}`);

        // TODO: Only iterate over dates where visit for that patient/stop is actually present
        for (let i = 0; i < visitOrders.length; i++) {
            const visitList = [];
            for (let j = 0; j < visitOrders[i].visitList.length; j++) {
                const visit = visitOrders[i].visitList[j];
                if (!(visit.isSubjectArchived())) {
                    visitList.push(visit);
                }
            }
            visitOrders[i].visitList = visitList;
        }
        const visitIDs = visits.map((visit) => visit.visitID);
        this.floDB.delete(visits);

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
    }

}
