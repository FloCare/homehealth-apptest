import RNSecureKeyStore from 'react-native-secure-key-store';
import {apiServerURL} from '../constants';

export function getPlaceByID(placeID) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
    .then(token => fetch(`${apiServerURL}/phi/v1.0/stops/${placeID}/`,
        {
            method: 'GET',
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
            }
        }))
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('HTTP request not OK');
    });
}
