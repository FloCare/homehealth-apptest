import {AsyncStorage} from "react-native";
import {UserDataService} from "../data_services/UserDataService";
import {setUserForInstabug} from './instabugUtils';
import {PatientDataService} from '../data_services/PatientDataService';

const store = {};

export async function initialiseStoreAndSetUserForInstabug() {
    if (getItem('myUserDetails')) return;
    const myUserDetails = await AsyncStorage.getItem('myUserDetails').then(async res => {
        if (res === null) {
            const userProps = await UserDataService.fetchUserProps();

            const userName = PatientDataService.constructName(userProps.firstName, userProps.lastName);
            setUserForInstabug(userProps.email, userName);

            AsyncStorage.setItem('myUserDetails', JSON.stringify(userProps));
            res = JSON.stringify(userProps);
        } else {
            const resJson = JSON.parse(res);
            //TODO Remove these checks
            if (!resJson.email || !resJson.orgID) {
                UserDataService.fetchUserProps().then(userProps => {
                    const userName = PatientDataService.constructName(userProps.firstName, userProps.lastName);
                    setUserForInstabug(userProps.email, userName);

                    AsyncStorage.setItem('myUserDetails', JSON.stringify(userProps));
                })
            }
            return resJson;
        }
    });
    setItem('myUserDetails', myUserDetails);
}

export function getItem(key) {
    return store[key];
}

export function setItem(key, value) {
    store[key] = value;
}
