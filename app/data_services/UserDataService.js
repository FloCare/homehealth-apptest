import {User} from '../utils/data/schema';
import {getItem} from '../utils/InMemoryStore';

export class UserDataService {
    static userID = null;
    static userDataService;

    static initialiseService(floDB, store) {
        UserDataService.userDataService = new UserDataService(floDB, store);
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    static getCurrentUserID() {
        return getItem('userID');
    }

    static getInstance() {
        if (!UserDataService.userDataService) {
            throw new Error('User Data service called without being initialised');
        }
        return UserDataService.userDataService;
    }

    getUserByID(userID) {
        this.floDB.objectForPrimaryKey(User.getSchemaName(), userID);
    }

}
