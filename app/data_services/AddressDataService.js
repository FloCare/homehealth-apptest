import {Address} from '../utils/data/schema';
import {AddressActions} from '../redux/Actions';
import {arrayToObjectByKey} from '../utils/collectionUtils';

class AddressDataService {
    static getFlatAddress(address) {
        return {
            addressID: address.addressID,
            formattedAddress: address.formattedAddress,

            latitude: address.latitude,
            longitude: address.longitude,
        };
    }

    static getFlatAddressMap(addresses) {
        return arrayToObjectByKey(addresses.map(address => AddressDataService.getFlatAddress(address)), 'addressID');
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    getAddressByID(addressID) {
        return this.floDB.objectForPrimaryKey(Address, addressID);
    }

    addAddressesToRedux(addresses) {
        this.store.dispatch({type: AddressActions.ADD_ADDRESSES, addressList: AddressDataService.getFlatAddressMap(addresses)});
    }

    updateAddressesInRedux(addresses) {
        this.store.dispatch({type: AddressActions.EDIT_ADDRESSES, addressList: AddressDataService.getFlatAddressMap(addresses)});
    }

    // Should be a part of a realm write transaction
    addAddressToTransaction(owner, address, addressId) {
        if (owner) {
            if (address.lat && address.long) {
                owner.address = {
                    addressID: addressId,
                    streetAddress: address.streetAddress ? address.streetAddress.toString().trim() : '',
                    apartmentNo: address.apartmentNo ? address.apartmentNo.toString().trim() : '',
                    zipCode: address.zipCode ? address.zipCode.toString().trim() : '',
                    city: address.city ? address.city.toString().trim() : '',
                    state: address.state ? address.state.toString().trim() : '',
                    country: address.country ? address.country.toString().trim() : 'US',
                    isValidated: true
                };
                owner.address.coordinates = {
                    latitude: address.lat,
                    longitude: address.long
                };
            } else {
                owner.address = {
                    addressID: addressId,
                    streetAddress: address.streetAddress ? address.streetAddress.toString().trim() : '',
                    apartmentNo: address.apartmentNo ? address.apartmentNo.toString().trim() : '',
                    zipCode: address.zipCode ? address.zipCode.toString().trim() : '',
                    city: address.city ? address.city.toString().trim() : '',
                    state: address.state ? address.state.toString().trim() : '',
                    country: address.country ? address.country.toString().trim() : 'US',
                    isValidated: false
                };
            }
        }
    }

    _parseResponse = (result, address) => {
        if (result.status === 'OK' &&
            result.results &&
            result.results.length > 0 &&
            result.results[0].geometry &&
            result.results[0].geometry.location
        ) {
            const loc = result.results[0].geometry.location;
            const latitude = loc.lat;
            const longitude = loc.lng;

            console.log('Fetched the lat long for address: ', address.streetAddress, ':', latitude, longitude);

            // Write to DB
            try {
                this.floDB.write(() => {
                    address.latitude = latitude;
                    address.longitude = longitude;
                    address.isValidated = true;
                });
            } catch (err) {
                // Todo Don't fail silently
                console.log('Error while writing to DB: ', err);
            }
        } else if (result.status === 'ZERO_RESULTS') {
            try {
                console.log('ZERO_RESULTS found by Google Geocode API for address:', address.streetAddress);
                this.floDB.write(() => {
                    address.latitude = null;
                    address.longitude = null;
                    address.isValidated = true;
                });
            } catch (err) {
                // Todo Don't fail silently
                console.log('Error while writing to DB:', err);
            }
        } else {
            console.log('Failed to parse Geocode Response from Google APIs');
            console.log(result.status);
            console.log(result.results[0].geometry.location);
        }
    };

    attemptFetchForPendingAddresses() {
        const unValidatedObjects = this.floDB.objects(Address.schema.name).filtered('isValidated = false');
        console.log('Number of unvalidated Objects:', unValidatedObjects.length);

        // Todo: Have hardcoded country filter as 'USA' currently
        if (unValidatedObjects && unValidatedObjects.length > 0) {
            unValidatedObjects.map((item) => {
                console.log('Trying to get lat-long for:', item.formattedAddressForGeocoding);
                fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${item.formattedAddressForGeocoding}&components=country:us&key=AIzaSyDiWZ3198smjFepUa0ZAoHePSnSxuhTzRU`)
                    .then((response) => response.json())
                    .then((responseJson) =>
                        this._parseResponse(responseJson, item))
                    .catch((error) =>
                        console.log('Error while fetching Geocoded address: ', error));
                return item;
            });
        }
    }
}

export let addressDataService;

export function initialiseService(floDB, store) {
    addressDataService = new AddressDataService(floDB, store);
}
