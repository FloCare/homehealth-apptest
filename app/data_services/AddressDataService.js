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
}

export let addressDataService;

export function initialiseService(floDB, store) {
    addressDataService = new AddressDataService(floDB, store);
}
