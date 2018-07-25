import RNSecureKeyStore from 'react-native-secure-key-store';
import {apiServerURL} from '../constants';

export function pushNewVisitsToServer(visits) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch(`${apiServerURL}/phi/v1.0/visits/?format=json`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    visits
                })
            }))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('HTTP request not OK');
        });
}

export function pushVisitUpdateToServer(visit) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch(`${apiServerURL}/phi/v1.0/visits/?format=json`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(visit),
            }))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('HTTP request not OK');
        });
}

export function getVisitsByID(visitIDs) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })//TODO correct this url
        .then(token => fetch(`${apiServerURL}/phi/v1.0/my-visits-details/`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    visits: visitIDs
                })
            }))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('HTTP request not OK');
        });
    // return new Promise((resolve) => {
    //     setTimeout(resolve, 300, {
    //         success: {
    //             1: {
    //                 id: 1,
    //                 name: 'Jeffery Lebowski',
    //                 primary_contact: '9964716595',
    //                 emergency_contact: '9964716595',
    //                 created_on: '2018-06-12T02:18:37.188873Z',
    //                 archived: false,
    //                 address: {
    //                     id: 1,
    //                     apartment_no: 'H-31',
    //                     streetAddress: 'Sterling Greenview 2',
    //                     zipCode: '56012',
    //                     city: 'Bengaluru',
    //                     state: 'KA',
    //                     country: 'India',
    //                     latitude: 1,
    //                     longitude: 1
    //                 },
    //                 organization: "Joe's Home Health"
    //             },
    //         }
    //     });
    // });
}
