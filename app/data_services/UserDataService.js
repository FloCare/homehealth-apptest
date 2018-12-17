import {User} from '../utils/data/schema';
import {getItem, setItem} from '../utils/InMemoryStore';
import {getUserProps} from '../utils/API/UserAPI';
import {AsyncStorage} from 'react-native';

export class UserDataService {
    static userDataService;

    static initialiseService(floDB, store) {
        UserDataService.userDataService = new UserDataService(floDB, store);
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    static getCurrentUserProps() {
        return getItem('myUserDetails');
    }

    static getInstance() {
        if (!UserDataService.userDataService) {
            throw new Error('User Data service called without being initialised');
        }
        return UserDataService.userDataService;
    }

    static fetchUserProps(id) {
        return getUserProps(id).then(userPropsJson => {
            const userID = userPropsJson.userID;
            const firstName = userPropsJson.firstName;
            const lastName = userPropsJson.lastName;
            const primaryContact = userPropsJson.primaryContact;
            const role = userPropsJson.roles[0].role;
            const org = userPropsJson.roles[0].org;
            const orgID = userPropsJson.roles[0].orgID;
            const email = userPropsJson.email;

            console.log('fetched userprops');
            console.log({
                userID,
                firstName,
                lastName,
                primaryContact,
                role,
                org,
                orgID,
                email
            });

            return {
                userID,
                firstName,
                lastName,
                primaryContact,
                role,
                org,
                orgID,
                email
            };
        }).catch((error) => {
            console.log('error in fetchUserProps');
            console.log(error);
            throw {name: 'MissingNecessaryInternetConnection'};
        });
    }

    fetchAndSaveUserToRealmIfMissing(id) {
        const user = this.getUserByID(id);
        console.log(`fetch and save user if missing ${id}`);
        if (user) {
            console.log(`found ${id}`);
            return new Promise((resolve) => resolve(user));
        }
        console.log(`not found ${id}`);

        return UserDataService.fetchUserProps(id).then(userJson => {
            console.log(`successfully fetched user props ${id}`);
            return this.saveUserToRealm(userJson);
        }).catch(error => {
            console.log(`error in fetch and save user${id}`);
            console.log(error);
            throw error;
        });
    }

    fetchAndUpdateUserInRealm(id) {
        const user = this.getUserByID(id);
        console.log('fetch and update user');
        if (!user) {
            console.log('didnt find user, skipping update');
            return;
        }
        console.log('found local copy of the user, performing a server update');

        return UserDataService.fetchUserProps(id).then(userJson => {
            console.log('successfully fetched user props');
            if (!id || id === UserDataService.getCurrentUserProps().userID) {
                AsyncStorage.setItem('myUserDetails', JSON.stringify(userJson));
                setItem('myUserDetails', userJson);
            }
            return this.saveUserToRealm(userJson);
        }).catch(error => {
            console.log('error in fetch and save user');
            console.log(error);
            throw error;
        });
    }

    saveUserToRealm(user) {
        let userObject;
        console.log('save user to realm');
        this.floDB.write(() => {
            userObject = this.floDB.create(User, user, true);
        });
        return userObject;
    }

    getUserByID(userID) {
        return this.floDB.objectForPrimaryKey(User, userID);
    }
}
