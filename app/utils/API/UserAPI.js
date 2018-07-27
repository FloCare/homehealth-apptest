import RNSecureKeyStore from 'react-native-secure-key-store';
import {apiServerURL} from '../constants';

export function getUserProps(userID) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch(`${apiServerURL}/users/v1.0/get-user-for-id/`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: userID ? JSON.stringify({userID}) : undefined
            }))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('HTTP request not OK');
        });

    // return new Promise((resolve) => {
    //     setTimeout(resolve, 300, {
    //         id: 999,
    //         roles: [
    //             {
    //                 role: 'PT',
    //                 org: 'ORG'
    //             }
    //         ]
    //     });
    // });
}
