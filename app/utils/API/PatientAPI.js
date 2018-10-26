// const accessToken = 'dummyAccessToken';

import RNSecureKeyStore from 'react-native-secure-key-store';
import {apiServerURL} from '../constants';

// Gets all patients that have been assigned to the user
export function getAllPatients() {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch(`${apiServerURL}/phi/v1.0/get-patients-for-sync/?format=json`,
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
}

export function getPatientsByID(patientIDs) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch(`${apiServerURL}/phi/v1.0/get-patients-for-ids/`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientIDs
                })
            }))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('HTTP request not OK');
        });
}

export function getPatientsByOldID(patientIDs) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch(`${apiServerURL}/phi/v1.0/get-patients-for-old-ids/`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientIDs
                })
            }))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('HTTP request not OK');
        });
}

export function getAllPatientsBasicInfo() {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch(`${apiServerURL}/phi/v1.0/get-patients-for-org/`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            }))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('HTTP request not OK');
        });
}

export function requestPatientAssignment(patientID) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch(`${apiServerURL}/phi/v1.0/add-patient-to-user/`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientID
                })
            }));
}
