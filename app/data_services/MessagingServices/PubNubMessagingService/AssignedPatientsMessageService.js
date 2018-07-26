import {AsyncStorage} from 'react-native';
import moment from 'moment/moment';
import {BaseMessagingService} from './BaseMessagingService';
import {PatientDataService} from '../../PatientDataService';
import {UserDataService} from '../../UserDataService';

export class AssignedPatientsMessageService extends BaseMessagingService {
    // async initialChannels() {
    //     return AsyncStorage.getItem('userID').then(res => {
    //         if (res === null) {
    //             return getUserProps().then(userPropsJson => {
    //                 const userID = userPropsJson.id.toString();
    //                 AsyncStorage.setItem('userID', userID);
    //                 return [`${userID}_assignedPatients`];
    //             });
    //         }
    //         return [`${res}_assignedPatients`];
    //     }).catch(error => {
    //         console.log(`error getting initial channel name: ${error}`);
    //         return null;
    //     });
    // }

    onMessage(messageObject) {
        const message = messageObject.message;
        return new Promise((resolve, reject) => {
            console.log('onMessage called');
            console.log(message);
            const {actionType, patientID} = message;
            switch (actionType) {
                case 'ASSIGN' :
                    PatientDataService.getInstance().fetchAndSavePatientsByID([patientID])
                        .then(() => resolve())
                        .catch(error => reject(error));
                    break;
                case 'UNASSIGN' :
                    try {
                        PatientDataService.getInstance().archivePatient(patientID.toString(), true);
                    } catch (e) {
                        reject(e);
                    }
                    resolve();
                    break;
                case 'UPDATE' :
                    PatientDataService.getInstance().fetchAndEditPatientsByID([patientID])
                        .then(() => resolve())
                        .catch(error => reject(error));
                    break;
                default:
                    // throw new Error('Unrecognised action type in assigned patient message');
                    console.log(`unrecognised message: ${message}`);
                    reject();
            }
        });
    }

    async _bootstrapChannels() {
        const userID = UserDataService.getCurrentUserProps().userID;
        let assignedVisitLastTimestamp = await AsyncStorage.getItem('assignedVisitLastTimestamp');
        if (!assignedVisitLastTimestamp) {
            assignedVisitLastTimestamp = (moment().valueOf() * 10000).toString();
        }

        console.log(`last assigned ${assignedVisitLastTimestamp}`);
        this._subscribeToChannelsByObject([{
            name: `${userID}_assignedPatients`,
            lastMessageTimestamp: assignedVisitLastTimestamp,
            handler: this.constructor.name,
        }]);
    }
}
