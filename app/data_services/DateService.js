import {DateActions} from '../redux/Actions';
import {VisitService} from './VisitServices/VisitService';

class DateService {
    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    setDate(date) {
        this.store.dispatch({type: DateActions.SET_DATE, date});
        VisitService.getInstance().loadVisitsForTheDayToRedux(date);
    }
}

export let dateService;

export function initialiseService(floDB, store) {
    dateService = new DateService(floDB, store);
}
