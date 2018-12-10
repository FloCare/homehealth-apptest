import {Patient, Place, User, Visit} from '../../schema';
import {UserDataService} from '../../../../data_services/UserDataService';
import {getItem} from '../../../InMemoryStore';

export const v007 = (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 7) {
        console.log('migravtion v7');
        //TODO migrate patient IDs, and episodes
        //create user object for current user and insert into db
        const userProps = UserDataService.getCurrentUserProps();
        const user = newRealm.create(User.getSchemaName(), {
            userID: userProps.userID,
            firstName: userProps.firstName,
            lastName: userProps.lastName,
            primaryContact: userProps.primaryContact,
            role: userProps.role,
        });
        console.log('user created');

        //attach the created user object here
        newRealm.objects(Visit.getSchemaName()).update('user', user);
        console.log('user set on visits');

        //Change ids
        const patientJsonByOldID = getItem('patientJsonByOldID');
        if (!patientJsonByOldID) { throw new Error('error in migration v7'); }
        console.log(patientJsonByOldID);
        const allPatients = newRealm.objects(Patient.getSchemaName());
        // console.log('all realm patients');
        // console.log(allPatients.snapshot().map(patient => patient.patientID));
        allPatients.snapshot().forEach(patient => {
            // console.log(patient.patientID);
                const newJson = patientJsonByOldID[patient.patientID];
                if (newJson) {
                    const existingEpisode = patient.episodes[0];
                    existingEpisode.episodeID = newJson.episodeID;

                    patient.patientID = newJson.patientID;
                    patient.episodes = [existingEpisode];
                } else if (!patient.isLocallyOwned) {
                    throw new Error(`didnt find data on server for ${patient.patientID}`);
                        // console.log(`came to delete:${patient.patientID}`);
                        // newRealm.delete(patient);
                        // console.log('delete successful');
                    }
            });

        //clean out places visits for safe migration
        newRealm.objects(Place.getSchemaName()).forEach(place => {
            newRealm.delete(place.visits);
        });
        // console.log(newRealm.objects(Patient.getSchemaName()));
    }
};
