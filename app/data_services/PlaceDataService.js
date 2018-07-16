import {Place} from '../utils/data/schema';
import {PlaceActions} from '../redux/Actions';
import {arrayToObjectByKey} from '../utils/collectionUtils';
import {addressDataService} from './AddressDataService';
import {visitDataService} from './VisitServices/VisitDataService';
import {parsePhoneNumber} from '../utils/lib';

class PlaceDataService {
    static getFlatPlace(place) {
        return {
            placeID: place.placeID,
            name: place.name,
            addressID: place.address.addressID,
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
            placeMap: PlaceDataService.getFlatPlaceMap(places)
        });
        addressDataService.updateAddressesInRedux(places.map(place => place.address));
    }

    addPlacesToRedux(places) {
        this.store.dispatch({type: PlaceActions.ADD_PLACES, placeMap: PlaceDataService.getFlatPlaceMap(places)});
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

    editExistingPlace(placeId, place) {
        let placeObj = null;
        this.floDB.write(() => {
            placeObj = this.floDB.objectForPrimaryKey(Place.schema.name, placeId);

            // Edit the corresponding address info
            addressDataService.addAddressToTransaction(placeObj, place, place.addressID);

            // Edit the place info
            this.floDB.create(Place.schema.name, {
                placeID: place.placeID,
                name: place.stopName ? place.stopName.toString().trim() : '',
                primaryContact: place.primaryContact ? parsePhoneNumber(place.primaryContact.toString().trim()) : '',
            }, true);
        });
        if (placeObj) {
            this.updatePlacesInRedux([placeObj]);
        }
    }

    archivePlace(placeId) {
        console.log('Archiving Place from realm for placeId:', placeId);
        let place = null;
        let obj = null;
        this.floDB.write(() => {
            place = this.floDB.objectForPrimaryKey(Place.schema.name, placeId);
            place.archived = true;
            obj = visitDataService.deleteVisits(place);
        });
        if (place) {
            this.archivePlacesInRedux([placeId]);
        }
        if (obj && obj.visits) {
            visitDataService.deleteVisitsFromRedux(obj.visits);
        }
        if (obj && obj.visitOrders) {
            for (let i = 0; i < obj.visitOrders.length; i++) {
                visitDataService.updateVisitOrderToReduxIfLive(obj.visitOrders[i].visitList, obj.visitOrders[i].midnightEpoch);
            }
        }
        console.log('Place archived. His visits Deleted');
    }

    archivePlacesInRedux(places) {
        console.log('Archiving places in Redux');
        this.store.dispatch({
            type: PlaceActions.ARCHIVE_PLACES,
            placeList: places
        });
    }
}

export let placeDataService;

export function initialiseService(floDB, store) {
    placeDataService = new PlaceDataService(floDB, store);
}
