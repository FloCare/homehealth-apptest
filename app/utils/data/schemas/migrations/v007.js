import {Visit} from '../../schema';
import {UserDataService} from '../../../../data_services/UserDataService';

export const v007 = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 7) {
        //todo create user object for current user and insert into db
        const userID = UserDataService.getCurrentUserID();
        const newVisitObjects = newRealm.objects(Visit.getSchemaName());
        //todo attach the created user object here
        newVisitObjects.update('userID', userID);
    }
};
