import {Visit} from '../../schema';
import {UserDataService} from '../../../../data_services/UserDataService';

export const v007 = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 7) {
        const userID = UserDataService.getCurrentUserID();
        const newVisitObjects = newRealm.objects(Visit.getSchemaName());
        newVisitObjects.update('userID', userID);
    }
};
