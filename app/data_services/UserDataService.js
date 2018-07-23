import {User} from '../utils/data/schema';

export class UserDataService {
    static userID = null;
    static userDataService;

    static async initialiseUser() {
        //TODO Fetch if user info not present in async storage and store it
        // if (!UserDataService.userID) {
        //     await AsyncStorage.getItem('userID').then(userID => {
        //         UserDataService.userID = userID;
        //     });
        // }
    }

    static initialiseService(floDB, store) {
        UserDataService.userDataService = new UserDataService(floDB, store);
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    static getCurrentUserID() {
        return UserDataService.userID;
    }

    static getInstance() {
        if (!UserDataService.userDataService) {
            throw new Error('User Data service called without being initialised');
        }
        return UserDataService.userDataService;
    }

    getUserByID(userID) {
        return this.floDB.objectForPrimaryKey(User.getSchemaName(), userID);
    }

}
