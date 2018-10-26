import {Place} from '../utils/data/schema';
import {PlaceActions} from '../redux/Actions';
import {arrayToObjectByKey} from '../utils/collectionUtils';
import {addressDataService} from './AddressDataService';
import {VisitService} from './VisitServices/VisitService';
import {parsePhoneNumber} from '../utils/lib';
import * as PlaceAPI from '../utils/API/PlaceAPI';
import {generateUUID} from '../utils/utils';

export class PlaceDataService {

    static placeDataService;

    static getFlatPlace(place) {
        return {
            placeID: place.placeID,
            name: place.name,
            addressID: place.address.addressID,
            primaryContact: place.primaryContact,
            visits: place.visits.map(visit => visit.visitID),
            isLocallyOwned: place.isLocallyOwned
        };
    }

    static initialiseService(floDB, store) {
        PlaceDataService.placeDataService = new PlaceDataService(floDB, store);
    }

    static getInstance() {
        if (!PlaceDataService.placeDataService) {
            throw new Error('Place data service requested before being initialised');
        }
        return PlaceDataService.placeDataService;
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

    createNewPlace(placeInformation, addressInformation, isLocallyOwned) {
        let newPlace = null;
        const {placeID, name, primaryContact, archived} = placeInformation;
        this.floDB.write(() => {
            newPlace = this.floDB.create(Place.schema.name, {
                placeID,
                name,
                primaryContact,
                archived,
                isLocallyOwned
            });

            addressDataService.addAddressToTransaction(newPlace, addressInformation, addressInformation.addressID);
        });
        if (newPlace) {
            this.addPlacesToRedux([newPlace]);
        }
    }

    createNewLocalPlace(place) {
        const placeID = generateUUID();
        const addressID = generateUUID();
        const placeInformation = {
            placeID,
            name: place.stopName,
            primaryContact: place.primaryContact,
            archived: false
        };
        this.createNewPlace(placeInformation, {...place, addressID}, true);
    }

    createNewSyncedPlace(placeData) {
        const placeInformation = {
            placeID: placeData.placeID,
            name: placeData.name,
            primaryContact: placeData.contactNumber,
            archived: !!placeData.inactive
        };
        const addressInformation = placeData.address;
        addressInformation.lat = placeData.address.latitude;
        addressInformation.long = placeData.address.longitude;
        this.createNewPlace(placeInformation, addressInformation, false);
    }

    fetchAndCreatePlaceByID(placeID) {
        return PlaceAPI.getPlaceByID(placeID).then((placeData) => {
            this.createNewSyncedPlace(placeData);
        });
    }

    fetchAndEditPlaceByID(placeID) {
        return PlaceAPI.getPlaceByID(placeID).then((placeData) => {
            const place = {
                ...placeData.address,
                placeID: placeData.placeID,
                stopName: placeData.name,
                primaryContact: placeData.contactNumber,
                lat: placeData.latitude,
                long: placeData.longitude
            };
            this.editExistingPlace(placeData.placeID, place);
        });
    }

    fetchAndSavePlacesFromServer() {
        return PlaceAPI.getPlacesFromServer().then((placesData) => {
            placesData.forEach(placeData => {
                try {
                    if (!this.getPlaceByID(placeData.placeID)) {
                        this.createNewSyncedPlace(placeData);
                    }
                } catch (e) {
                    console.log('error in creating new synced place');
                    console.log(placeData);
                }
            });
        });
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
        const place = this.floDB.objectForPrimaryKey(Place.schema.name, placeId);
        
        if (place) {
            this.floDB.write(() => {
                place.archived = true;
            });
            VisitService.getInstance().deleteVisitsForSubject(place);
            this.archivePlacesInRedux([placeId]);
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
