import firebase from 'react-native-firebase';
import {Patient, Visit, VisitOrder, Place} from '../../utils/data/schema';
import {arrayToObjectByKey} from '../../utils/collectionUtils';
import {generateUUID, todayMomentInUTCMidnight} from '../../utils/utils';
import {eventNames, parameterValues} from '../../utils/constants';
import {VisitReduxService} from './VisitReduxService';
import {VisitRealmService} from './VisitRealmService';

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
            placeID: !isPatientVisit ? visit.getPlace().placeID : null,
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

    setVisitOrderForDate(orderedVisitID, midnightEpoch) {
        const visitList = this.visitRealmService.saveVisitOrderForDate(orderedVisitID, midnightEpoch);
        this.visitReduxService.updateVisitOrderToReduxIfLive(visitList, midnightEpoch);
    }

    loadVisitsForTheDayToRedux(midnightEpoch) {
        const visitsOfDay = this.visitRealmService.getVisitsForDate(midnightEpoch);
        this.visitReduxService.addVisitsToRedux(visitsOfDay);

        const visitOrderOfDay = this.visitRealmService.getVisitOrderForDate(midnightEpoch);
        this.visitReduxService.setVisitOrderInRedux(visitOrderOfDay.visitList);
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

    createNewVisits(visitOwners, midnightEpoch) {
        const newVisits = [];
        this.floDB.write(() => {
            for (const visitSubject of visitOwners) {
                const visit = this.floDB.create(Visit, {
                    visitID: generateUUID(),
                    midnightEpochOfVisit: midnightEpoch
                });
                newVisits.push(visit);
                if (visitSubject instanceof Patient) { visitSubject.episodes[0].visits.push(visit); } else visitSubject.visits.push(visit);
            }
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

    // Should be a part of a write transaction
    deleteVisitsForOwner(owner) {
        console.log('Deleting visits from realm');
        const today = todayMomentInUTCMidnight();
        let visits = null;
        // Todo: Check if this works
        if (owner instanceof Patient) {
            console.log('Deleting patient');
            visits = owner.getFirstEpisode().visits.filtered(`midnightEpochOfVisit >= ${today}`);
        } else if (owner instanceof Place) {
            console.log('Deleting Place');
            visits = owner.visits.filtered(`midnightEpochOfVisit >= ${today}`);
        }
        const visitOrders = this.floDB.objects(VisitOrder.schema.name).filtered(`midnightEpoch >= ${today}`);

        // TODO: Only iterate over dates where visit for that patient/stop is actually present
        for (let i = 0; i < visitOrders.length; i++) {
            const visitList = [];
            for (let j = 0; j < visitOrders[i].visitList.length; j++) {
                const visit = visitOrders[i].visitList[j];
                if (!(visit.isOwnerArchived())) {
                    visitList.push(visit);
                }
            }
            visitOrders[i].visitList = visitList;
        }
        this.floDB.delete(visits);

        if (visits) {
            this.visitReduxService.deleteVisitsFromRedux(visits);
        }
        if (visitOrders) {
            for (let i = 0; i < visitOrders.length; i++) {
                this.visitReduxService.updateVisitOrderToReduxIfLive(visitOrders[i].visitList, visitOrders[i].midnightEpoch);
            }
        }
    }
}
