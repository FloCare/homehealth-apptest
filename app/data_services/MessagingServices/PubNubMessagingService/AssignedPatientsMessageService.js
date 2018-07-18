import {AsyncStorage} from 'react-native';
import {BaseMessagingService} from './BaseMessagingService';
import {PatientDataService} from '../../PatientDataService';

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

    onMessage(message) {
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

    async getSeedChannels() {
        const userID = await AsyncStorage.getItem('userID');
        let assignedVisitLastTimestamp = await AsyncStorage.getItem('assignedVisitLastTimestamp');
        if (!assignedVisitLastTimestamp) {
            assignedVisitLastTimestamp = '0';
        }

        console.log(`last assigned ${assignedVisitLastTimestamp}`);
        return [{
            name: `${userID}_assignedPatients`,
            lastMessageTimestamp: assignedVisitLastTimestamp,
            handler: this.constructor.name,
        }];
    }
}
