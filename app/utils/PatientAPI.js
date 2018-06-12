// const accessToken = 'dummyAccessToken';

export function getPatientIDList() {
    // return fetch('get-patient-url', {credentials: 'and other things'})
    //     .then(response => {
    //         console.log('here3');
    //
    //         if (response.ok) {
    //             return response.json;
    //         }
    //         throw new Error('HTTP request not OK');
    //     });
    return new Promise((resolve) => {
        setTimeout(resolve, 300, {
            patients: [1, 2, 3, 4]
        });
    });
}

export function getPatientsByID(patientIDs) {
    // return fetch('get-patietn-url', {credentials: 'creds'})
    //     .then(response => {
    //         console.log('here4');
    //         if (response.ok) {
    //             return response.json;
    //         }
    //         throw new Error('HTTP request not OK');
    //     });
    return new Promise((resolve) => {
        setTimeout(resolve, 300, {
            success: {
                1: {
                    id: 1,
                    name: 'Jeffery Lebowski',
                    primary_contact: '9964716595',
                    emergency_contact: '9964716595',
                    created_on: '2018-06-12T02:18:37.188873Z',
                    archived: false,
                    address: {
                        id: 1,
                        apartment_no: 'H-31',
                        streetAddress: 'Sterling Greenview 2',
                        zipCode: '56012',
                        city: 'Bengaluru',
                        state: 'KA',
                        country: 'India',
                        latitude: 1,
                        longitude: 1
                    },
                    organization: "Joe's Home Health"
                },
            }
        });
    });
}
