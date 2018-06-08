import {PlaceActions} from '../Actions';

export default function PlaceReducer(places = {}, action) {
    switch (action.type) {
        case PlaceActions.ADD_PLACES:
            if (action.placeMap) { return {...action.placeMap, ...places}; }
            return places;
        case PlaceActions.EDIT_PLACES:
            return {...places, ...action.placeMap};
        case PlaceActions.ARCHIVE_PLACES:
            const newPlaces = {...places};
            if (newPlaces && action.placeList) {
                action.placeList.forEach(
                    placeID => {
                        if (newPlaces[placeID]) {
                            newPlaces[placeID].archived = true;
                        }
                    });
            }
            return newPlaces;
        default:
            return places;
    }
}
