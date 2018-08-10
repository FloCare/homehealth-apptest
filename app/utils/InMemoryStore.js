import {AsyncStorage} from "react-native";
import {UserDataService} from "../data_services/UserDataService";
import {setUserForInstabug} from './instabugUtils';
import {PatientDataService} from '../data_services/PatientDataService';

const store = {};

export async function initialiseStoreAndSetInstabug() {
    const myUserDetails = await AsyncStorage.getItem('myUserDetails').then(async res => {
        // TODO email check temporary for instabug to be removed
        // https://flocare.atlassian.net/browse/FC-62
        if (res === null || !res.email) {
            const userProps = await UserDataService.fetchUserProps();
            const userName = PatientDataService.constructName(userProps.firstName, userProps.lastName);
            setUserForInstabug(userProps.email, userName);
            AsyncStorage.setItem('myUserDetails', JSON.stringify(userProps));
            res = JSON.stringify(userProps);
        }
        return JSON.parse(res);
    });
    setItem('myUserDetails', myUserDetails);
}

export function getItem(key) {
    return store[key];
}

export function setItem(key, value) {
    store[key] = value;
}
