import firebase from 'react-native-firebase';
import {Patient, Visit, VisitOrder, Place} from '../utils/data/schema';
import {VisitActions, VisitOrderActions} from '../redux/Actions';
import {arrayToMap, arrayToObjectByKey, filterResultObjectByListMembership} from '../utils/collectionUtils';
import {generateUUID, todayMomentInUTCMidnight} from '../utils/utils';
import {PatientDataService} from './PatientDataService';
import {placeDataService} from './PlaceDataService';
import {eventNames} from '../utils/constants';

class VisitDataService {
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
        return arrayToObjectByKey(visits.map(visit => VisitDataService.getFlatVisit(visit)), 'visitID');
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    getVisitByID(visitID) {
        return this.floDB.objectForPrimaryKey(Visit, visitID);
    }

    setVisitOrderInRedux(visitOrder) {
        this.store.dispatch({type: VisitOrderActions.SET_ORDER, visitOrder: visitOrder.map(visit => visit.visitID)});
    }

    updateVisitOrderToReduxIfLive(visitList, midnightEpoch) {
        // console.log('checking to see if visit order date matches state date');
        console.log('Updating visit order in Redux for date:', midnightEpoch);
        if (this.store.getState().date === midnightEpoch) {
            // console.log('checking to see if visit order date matches state date');
            this.setVisitOrderInRedux(visitList);
        }
    }

    setVisitOrderByID(orderedVisitID, midnightEpoch) {
        const allVisits = this.floDB.objects(Visit);
        const currentVisitListByID = arrayToObjectByKey(filterResultObjectByListMembership(allVisits, 'visitID', orderedVisitID), 'visitID');

        const visitOrder = this.floDB.objectForPrimaryKey(VisitOrder, midnightEpoch);
        this.floDB.write(() => {
            visitOrder.visitList = orderedVisitID.map(visitID => currentVisitListByID[visitID]);
        });

        // console.log(visitOrder);
        this.updateVisitOrderToReduxIfLive(visitOrder.visitList, midnightEpoch);
    }

    updateVisitToRedux(visit) {
        this.store.dispatch({type: VisitActions.EDIT_VISITS, visitList: VisitDataService.getFlatVisitMap([visit])});
    }

    addVisitsToRedux(visits) {
        this.store.dispatch({type: VisitActions.ADD_VISITS, visitList: VisitDataService.getFlatVisitMap(visits)});
        this.patientDataService().addPatientsToRedux(visits.map(visit => visit.getPatient()).filter(patient => patient));
        placeDataService.addPlacesToRedux(visits.map(visit => visit.getPlace()).filter(place => place));
    }

    deleteVisitsFromRedux(visits) {
        console.log('Deleting visits from Redux');
        this.store.dispatch({
            type: VisitActions.DELETE_VISITS,
            visitList: VisitDataService.getFlatVisitMap(visits)
        });
    }

    loadVisitsForTheDayToRedux(midnightEpoch) {
        const visitsOfDay = this.floDB.objects(Visit).filtered(`midnightEpochOfVisit = ${midnightEpoch}`);
        this.addVisitsToRedux(visitsOfDay);

        let visitOrder = this.floDB.objectForPrimaryKey(VisitOrder, midnightEpoch);
        if (!visitOrder) {
            this.floDB.write(() => {
                visitOrder = this.floDB.create(VisitOrder, {midnightEpoch, visitList: []});
            });
        }

        this.setVisitOrderInRedux(visitOrder.visitList);
    }

    toggleVisitDone(visitID) {
        console.log(`${visitID}toggled`);
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

        this.updateVisitToRedux(visit);
        this.updateVisitOrderToReduxIfLive(currentVisitOrder.visitList, visit.midnightEpochOfVisit);
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

        this.updateVisitToRedux(visit);
        this.updateVisitOrderToReduxIfLive(currentVisitOrder.visitList, visit.midnightEpochOfVisit);
    }

    insertToOrderedVisits(visits, midnightEpoch) {
        const allVisits = this.floDB.objects(Visit).filtered('midnightEpochOfVisit=$0', midnightEpoch);
        let visitOrderObject = this.floDB.objectForPrimaryKey(VisitOrder, midnightEpoch);
        if (!visitOrderObject) {
            this.floDB.write(() => {
                visitOrderObject = this.floDB.create(VisitOrder, {midnightEpoch, visitList: []});
            });
        }
        const visitListByID = arrayToMap(visitOrderObject.visitList, 'visitID');

        let indexOfFirstDoneVisit;
        for (indexOfFirstDoneVisit = 0; indexOfFirstDoneVisit < visitOrderObject.visitList.length && !visitOrderObject.visitList[indexOfFirstDoneVisit].isDone; indexOfFirstDoneVisit++) {

        }

        const newVisitOrder = [];
        newVisitOrder.push(...visitOrderObject.visitList.slice(0, indexOfFirstDoneVisit));
        for (let j = 0; j < allVisits.length; j++) {
            if (!visitListByID.has(allVisits[j].visitID)) {
                newVisitOrder.push(allVisits[j]);
            }
        }
        newVisitOrder.push(...visitOrderObject.visitList.slice(indexOfFirstDoneVisit, visitOrderObject.visitList.length));

        this.floDB.write(() => {
                    visitOrderObject.visitList = newVisitOrder;
                });

        // TODO discuss if this is the right place to log this event
        firebase.analytics().logEvent(eventNames.ADD_VISIT, {
            'VALUE': newVisitOrder.length
        });

        //TELLING REDUX ABOUT IT
        if (midnightEpoch === this.store.getState().date) {
            console.log('dispatching visits');
            this.addVisitsToRedux(visits);

            console.log('dispatching visits order');
            this.setVisitOrderInRedux(newVisitOrder);
        }
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

        this.insertToOrderedVisits(newVisits, midnightEpoch);
    }

    // Should be a part of a write transaction
    deleteVisits(owner) {
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
        const obj = {visits, visitOrders};
        return obj;
    }

    // External Services
    patientDataService = () => {
        return PatientDataService.getInstance();
    };

}

export let visitDataService;

export function initialiseService(floDB, store) {
    visitDataService = new VisitDataService(floDB, store);
}
