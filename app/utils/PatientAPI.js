// const accessToken = 'dummyAccessToken';

import RNSecureKeyStore from 'react-native-secure-key-store';

export function getPatientIDList() {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch('http://app-9707.on-aptible.com/phi/v1.0/my-patients/?format=json',
            {
                method: 'GET',
                headers: {
                    Authorization: `Token ${token}`,
                },
            }))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('HTTP request not OK');
        });
    // return new Promise((resolve) => {
    //     setTimeout(resolve, 300, {
    //         patients: [1, 2, 3, 4]
    //     });
    // });
}

export function getPatientsByID(patientIDs) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch('http://app-9707.on-aptible.com/phi/v1.0/my-patients-details/',
            {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patients: patientIDs
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
