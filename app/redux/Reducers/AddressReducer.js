import {AddressActions} from '../Actions';

export default function AddressReducer(addresses = {}, action) {
    switch (action.type) {
        case AddressActions.ADD_ADDRESSES:
            return {...action.addressList, ...addresses};
        case AddressActions.EDIT_ADDRESSES:
            return {...addresses, ...action.addressList};
        default:
            return addresses;
    }
}
