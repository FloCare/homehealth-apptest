import {Place} from '../utils/data/schema';
import {PlaceActions} from '../redux/Actions';
import {arrayToObjectByKey} from '../utils/collectionUtils';
import {addressDataService} from './AddressDataService';

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
        return arrayToObjectByKey(places.map(place => PlaceDataService.getFlatPlace(place)), 'placeID');
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    getPlaceByID(placeID) {
        return this.floDB.objectForPrimaryKey(Place, placeID);
    }

    addPlacesToRedux(places) {
        this.store.dispatch({type: PlaceActions.ADD_PLACES, placeList: PlaceDataService.getFlatPlaceMap(places)});
        addressDataService.updateAddressesInRedux(places.map(place => place.address));
    }
}

export let placeDataService;

export function initialiseService(floDB, store) {
    placeDataService = new PlaceDataService(floDB, store);
}
