import {Patient, Visit, VisitOrder} from '../utils/data/schema';
import {VisitActions, VisitOrderActions} from '../redux/Actions';
import {arrayToMap, arrayToObjectByKey} from '../utils/collectionUtils';
import {generateUUID} from '../utils/utils';
import {patientDataService} from './PatientDataService';
import {placeDataService} from './StopDataService';

class VisitDataService {
    static getFlatVisit(visit) {
        return {
            visitID: visit.visitID,
            patientID: visit.getPatient() ? visit.getPatient().patientID : null,
            place: visit.getPlace() ? visit.getPlace().placeID : null,
            isDone: visit.isDone,
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

    addVisitsToRedux(visits) {
        this.store.dispatch({type: VisitActions.ADD_VISITS, visitList: VisitDataService.getFlatVisitMap(visits)});
        patientDataService.addPatientsToRedux(visits.map(visit => visit.getPatient()).filter(patient => patient));
        placeDataService.addPlacesToRedux(visits.map(visit => visit.getPlace()).filter(place => place));
    }

    loadVisitsForTheDay(date) {
        const visitsOfDay = this.floDB.objects(Visit).filtered(`midnightEpochOfVisit = ${date}`);
        this.addVisitsToRedux(visitsOfDay);
        const visitOrder = this.floDB.objectForPrimaryKey(VisitOrder, date);
        if (visitOrder) { this.setVisitOrderInRedux(visitOrder.visitList); }
    }

    markVisitCompleted(visitID) {
        this.floDB.write(() => {
            this.getVisitByID(visitID).isDone = true;
        });
        this.store.dispatch({type: VisitActions.EDIT_VISITS, visitList: VisitDataService.getFlatVisitMap([this.getVisitByID(visitID)])});
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

        // TODO write order to realm

        //TELLING REDUX ABOUT IT
        if (midnightEpoch === this.store.getState().date) {
            console.log('dispatching visits');
            this.addVisitsToRedux(visits);

            console.log('dispatching visits order');
            this.setVisitOrderInRedux(newVisitOrder);
        }
    }
    
    createVisits(visitOwners, midnightEpoch) {
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
}

export let visitDataService;

export function initialiseService(floDB, store) {
    visitDataService = new VisitDataService(floDB, store);
}
