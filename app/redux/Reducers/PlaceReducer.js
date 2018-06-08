import {PlaceActions} from '../Actions';

export default function PlaceReducer(places = {}, action) {
    switch (action.type) {
        case PlaceActions.ADD_PLACES:
            if (action.placeList) { return {...action.placeList, ...places}; }
            return places;
        case PlaceActions.EDIT_PLACES:
            return {...places, ...action.placeList};
        case PlaceActions.ARCHIVE_PLACES:
            const newPlaces = {...places};
            if (newPlaces && action.placeList) {
                Object.keys(action.placeList).map(
                    key => {
                        if (key in newPlaces) {
                            newPlaces[key].archived = true;
                            return newPlaces[key];
                        }
                        return null;
                    });
            }
            return newPlaces;
        default:
            return places;
    }
}
