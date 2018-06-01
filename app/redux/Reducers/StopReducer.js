import StopActions from '../Actions';

export function StopReducer(stops = {}, action) {
    switch (action.type) {
        case StopActions.ADD_STOPS:
            return {...stops, ...action.stopList};
        case StopActions.EDIT_STOP:
            return {...stops, ...action.stopList};
        default:
            return stops;
    }
}
