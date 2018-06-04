import {Place} from '../utils/data/schema';
import {PlaceActions} from '../redux/Actions';
import {arrayToObjectByKey} from '../utils/collectionUtils';

class PlaceDataService {
    static getFlatPlace(place) {
        return {
            placeID: place.placeID,
            name: place.name,
            address: place.address.addressID,
            primaryContact: place.primaryContact,
            visits: place.visits.map(visit => visit.visitID),
        };
    }

    static getFlatPlaceMap(places) {
        arrayToObjectByKey(places.map(place => PlaceDataService.getFlatPlace(place)), 'placeID');
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    getPlaceByID(placeID) {
        return this.floDB.objectForPrimaryKey(Place, placeID);
    }

    addPlacesToRedux(places) {
        this.store.dispatch({type: PlaceActions.ADD_PLACES, place: PlaceDataService.getFlatPlaceMap(places)});
    }
}

export let placeDataService;

export function initialiseService(floDB, store) {
    placeDataService = new PlaceDataService(floDB, store);
}
