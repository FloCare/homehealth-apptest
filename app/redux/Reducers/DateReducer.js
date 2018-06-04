import {DateActions} from '../Actions';
import {todayMomentInUTCMidnight} from '../../utils/utils';

export default function DateReducer(date = todayMomentInUTCMidnight().valueOf(), action) {
    switch (action.type) {
        case DateActions.SET_DATE:
            return action.date;
        default:
            return date;
    }
}
