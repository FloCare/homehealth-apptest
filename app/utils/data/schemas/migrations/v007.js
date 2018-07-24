import {User, Visit} from '../../schema';
import {UserDataService} from '../../../../data_services/UserDataService';

export const v007 = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 7) {
        //TODO migrate patient IDs, and episodes
        //create user object for current user and insert into db
        const userProps = UserDataService.getCurrentUserProps();
        const user = newRealm.create(User, {
            userID: userProps.userID,
            firstName: userProps.firstName,
            lastName: userProps.lastName,
            primaryContact: userProps.primaryContact,
            role: userProps.role,
        });

        //attach the created user object here
        newRealm.objects(Visit.getSchemaName()).update('user', user);
    }
};
