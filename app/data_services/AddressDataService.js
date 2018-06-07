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
                    zipCode: address.zip ? address.zip.toString().trim() : '',
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
                    zipCode: address.zip ? address.zip.toString().trim() : '',
                    city: address.city ? address.city.toString().trim() : '',
                    state: address.state ? address.state.toString().trim() : '',
                    country: address.country ? address.country.toString().trim() : 'US',
                    isValidated: false
                };
            }
        }
    }
}

export let addressDataService;

export function initialiseService(floDB, store) {
    addressDataService = new AddressDataService(floDB, store);
}
