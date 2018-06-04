import {PlaceActions} from '../Actions';

export default function StopReducer(stops = {}, action) {
    switch (action.type) {
        case PlaceActions.ADD_PLACES:
            if (action.stopList) { return {...action.stopList, ...stops}; }
            return stops;
        case PlaceActions.EDIT_PLACES:
            return {...stops, ...action.stopList};
        default:
            return stops;
    }
}
