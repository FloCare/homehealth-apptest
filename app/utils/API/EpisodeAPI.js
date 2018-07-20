import RNSecureKeyStore from 'react-native-secure-key-store';
import {apiServerURL} from '../constants';

export function getEpisodeDetailsByIds(episodeIds) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
    .then(token => fetch(`${apiServerURL}/phi/v1.0/episode-details/`,
        {
            method: 'POST',
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                episodeIds
            })
        }))
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('HTTP request not OK');
    });
}
