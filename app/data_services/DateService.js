import {DateActions} from '../redux/Actions';
import {visitDataService} from './VisitServices/VisitDataService';

class DateService {
    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    setDate(date) {
        this.store.dispatch({type: DateActions.SET_DATE, date});
        visitDataService.loadVisitsForTheDayToRedux(date);
    }
}

export let dateService;

export function initialiseService(floDB, store) {
    dateService = new DateService(floDB, store);
}
