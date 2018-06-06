import {PlaceActions} from '../Actions';

export default function PlaceReducer(places = {}, action) {
    switch (action.type) {
        case PlaceActions.ADD_PLACES:
            if (action.placeList) { return {...action.placeList, ...places}; }
            return places;
        case PlaceActions.EDIT_PLACES:
            return {...places, ...action.placeList};
        default:
            return places;
    }
}
