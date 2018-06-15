import {addressDataService} from '../data_services/AddressDataService';


const HandleConnectionChange = (connectionInfo) => {
    if (connectionInfo.type === 'none') {
        console.log('Device went offline');
    } else {
        addressDataService.attemptFetchForPendingAddresses();
    }
};

export {HandleConnectionChange};
