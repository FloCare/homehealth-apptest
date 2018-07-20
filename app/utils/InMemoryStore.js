import {AsyncStorage} from "react-native";
import {getUserProps} from "./API/UserAPI";

const store = {};

export async function initialiseStore() {
    const userID = await AsyncStorage.getItem('userID').then(res => {
        if (res === null) {
            return getUserProps().then(userPropsJson => {
                const userID = userPropsJson.id.toString();
                AsyncStorage.setItem('userID', userID);
                return userID;
            }).catch(error => {
                throw {name: 'MissingNecessaryInternetConnection'}
            });
        }
        return res;
    });
    setItem('userID', userID);
}

export function getItem(key) {
    return store[key];
}

export function setItem(key, value) {
    store[key] = value;
}
