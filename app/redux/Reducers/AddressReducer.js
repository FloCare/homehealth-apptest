import AddressActions from '../Actions';

export default function AddressReducer(addresses = {}, action) {
    switch (action.type) {
        case AddressActions.ADD_ADDRESSES:
            return {...addresses, ...action.addressList};
        case AddressActions.EDIT_ADDRESS:
            return {...addresses, ...action.addressList};
        default:
            return addresses;
    }
}
