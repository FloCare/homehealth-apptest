import {User} from '../utils/data/schema';
import {getItem} from '../utils/InMemoryStore';
import {getUserProps} from '../utils/API/UserAPI';

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
            const email = userPropsJson.email;

            console.log('fetched userprops');
            console.log({
                userID,
                firstName,
                lastName,
                primaryContact,
                role,
                org,
                email
            });

            return {
                userID,
                firstName,
                lastName,
                primaryContact,
                role,
                org,
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
        console.log('fetch and save user if missing');
        if (user) {
            console.log('found');
            return new Promise((resolve) => resolve(user));
        }
        console.log('not found');

        return UserDataService.fetchUserProps(id).then(userJson => {
            console.log('successfully fetched user props');
            return this.saveUserToRealm(userJson);
        }).catch(error => {
            console.log('error in fetch and save user');
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
            return this.saveUserToRealm(userJson);
        }).catch(error => {
            console.log('error in fetch and save user');
            console.log(error);
            throw error;
        });
    }

    saveUserToRealm(user) {
        let userObject;
        console.log('save to realm');
        this.floDB.write(() => {
            userObject = this.floDB.create(User, user, true);
        });
        console.log('save to realm');
        console.log(userObject);
        return userObject;
    }

    getUserByID(userID) {
        return this.floDB.objectForPrimaryKey(User, userID);
    }
}
