import RNSecureKeyStore from 'react-native-secure-key-store';
import {apiServerURL} from '../constants';

export function pushReportInformation(report) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    }).then(token => fetch(`${apiServerURL}/phi/v1.0/create-report-for-visits/`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            reportID: report.reportID,
            reportItems: report.reportItems
        })
    })).then(response => {
        return response;
    })
    .catch(error => {
        console.log('api call error');
        console.log(error);
        throw error;
    });
}

export function getReportDetailsByIds(reportIDs) {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    }).then(token => fetch(`${apiServerURL}/phi/v1.0/get-reports-detail-by-ids/`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            reportIDs
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
