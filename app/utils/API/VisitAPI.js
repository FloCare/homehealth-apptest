import RNSecureKeyStore from 'react-native-secure-key-store';
import {apiServerURL} from '../constants';

export function pushNewVisitsToServer(visits) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch(`${apiServerURL}/phi/v1.0/add-visits/?format=json`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
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
        })
        .catch(error => {
            console.log('api call error');
            console.log(error);
            throw error;
        });
}

export function pushVisitUpdateToServer(visit) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch(`${apiServerURL}/phi/v1.0/update-visit-for-id/?format=json`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visit),
            }))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('HTTP request not OK');
        })
        .catch(error => {
            console.log('api call error');
            console.log(error);
            throw error;
        });
}

export function getVisitsByID(visitIDs) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    }).then(token => fetch(`${apiServerURL}/phi/v1.0/get-visits-for-ids/`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            visitIDs
        })
    })).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('HTTP request not OK');
    })
        .catch(error => {
            console.log('api call error');
            console.log(error);
            throw error;
    });
}

export function getAllMyVisits() {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    }).then(token => fetch(`${apiServerURL}/phi/v1.0/get-visits-for-user/`, {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
        },
    })).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('HTTP request not OK');
    })
        .catch(error => {
            console.log('api call error');
            console.log(error);
            throw error;
    });
}

export function pushVisitDeleteByIDs(visitIDs) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    }).then(token => fetch(`${apiServerURL}/phi/v1.0/delete-visit-for-id/`, {
        method: 'DELETE',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            visitIDs
        })
    })).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('HTTP request not OK');
    })
        .catch(error => {
            console.log('api call error');
            console.log(error);
            throw error;
    });
}
