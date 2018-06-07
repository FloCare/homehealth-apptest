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

    updatePlacesInRedux(places) {
        this.store.dispatch({
            type: PlaceActions.EDIT_PLACES,
            patientList: PlaceActions.getFlatPlaceMap(places)
        });
        addressDataService.updateAddressesInRedux(places.map(place => place.address));
    }

    addPlacesToRedux(places) {
        this.store.dispatch({type: PlaceActions.ADD_PLACES, placeList: PlaceDataService.getFlatPlaceMap(places)});
        addressDataService.updateAddressesInRedux(places.map(place => place.address));
    }

    createNewPlace(place) {
        // Todo: Add proper ID generators
        const placeId = Math.random().toString();
        const addressId = Math.random().toString();

        let newPlace = null;
        this.floDB.write(() => {
            newPlace = this.floDB.create(Place.schema.name, {
                placeID: placeId,
                name: place.stopName,
                primaryContact: place.primaryContact
            });

            addressDataService.addAddressToTransaction(newPlace, place, addressId);
        });
        if (newPlace) {
            this.addPlacesToRedux([newPlace]);
        }
    }
}

export let placeDataService;

export function initialiseService(floDB, store) {
    placeDataService = new PlaceDataService(floDB, store);
}
