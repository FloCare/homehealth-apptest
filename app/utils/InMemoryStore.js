import {AsyncStorage} from "react-native";
import {UserDataService} from "../data_services/UserDataService";

const store = {};

export async function initialiseStore() {
    const myUserDetails = await AsyncStorage.getItem('myUserDetails').then(async res => {
        if (res === null) {
            const userProps = await UserDataService.fetchUserProps();
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
