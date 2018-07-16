import {VisitActions, VisitOrderActions} from '../../redux/Actions';
import {placeDataService} from '../PlaceDataService';
import {VisitDataService} from './VisitDataService';
import {PatientDataService} from '../PatientDataService';

export class VisitReduxService {
    static visitReduxService;

    static initialiseService(store) {
        VisitReduxService.visitReduxService = new VisitReduxService(store);
        return VisitReduxService.visitReduxService;
    }

    static getInstance() {
        if (!VisitReduxService.visitReduxService) {
            throw new Error('Visit redux service requested before being initialised');
        }

        return VisitReduxService.visitReduxService;
    }

    constructor(store) {
        this.store = store;
    }

    getActiveDate() {
        return this.store.getState().date;
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

    updateVisitToRedux(visit) {
        this.store.dispatch({type: VisitActions.EDIT_VISITS, visitList: VisitDataService.getFlatVisitMap([visit])});
    }

    addVisitsToRedux(visits) {
        this.store.dispatch({type: VisitActions.ADD_VISITS, visitList: VisitDataService.getFlatVisitMap(visits)});
        PatientDataService.getInstance().addPatientsToRedux(visits.map(visit => visit.getPatient()).filter(patient => patient));
        placeDataService.addPlacesToRedux(visits.map(visit => visit.getPlace()).filter(place => place));
    }

    deleteVisitsFromRedux(visits) {
        console.log('Deleting visits from Redux');
        this.store.dispatch({
            type: VisitActions.DELETE_VISITS,
            visitList: VisitDataService.getFlatVisitMap(visits)
        });
    }
}
