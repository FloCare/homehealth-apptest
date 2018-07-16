import {AsyncStorage} from 'react-native';
import {BaseMessagingService} from './BaseMessagingService';
import {PatientDataService} from '../../PatientDataService';
import {getUserProps} from '../../../utils/API/UserAPI';

export class AssignedPatientsMessageService extends BaseMessagingService {
    async initialChannels() {
        return AsyncStorage.getItem('userID').then(res => {
            if (res === null) {
                return getUserProps().then(userPropsJson => {
                    const userID = userPropsJson.id.toString();
                    AsyncStorage.setItem('userID', userID);
                    return [`${userID}_assignedPatients`];
                });
            }
            return [`${res}_assignedPatients`];
        }).catch(error => {
            console.log(`error getting initial channel name: ${error}`);
            return null;
        });
    }

    async processFromHistory() {
        console.log('processFromHistory');
        let assignedVisitLastTimestamp = await AsyncStorage.getItem('assignedVisitLastTimestamp');
        console.log(assignedVisitLastTimestamp);
        if (!assignedVisitLastTimestamp) {
            assignedVisitLastTimestamp = 0;
        }

        //TODO adapt for multiple channels
        this.newClient().history({
            channel: this.channels[0],
            reverse: true,
            start: assignedVisitLastTimestamp,
            stringifiedTimeToken: true,
        }).then(response => {
            console.log('processfromhistory response');
            console.log(response);
            for (const message of response.messages) {
                this.onMessage(message.entry, message.timetoken);
            }
        }).catch(error => {
            console.log('error in history call');
            console.log(error);
        });
    }

    onNotificationRegister(notificationTokenObject) {
        this.registerDeviceOnChannels(notificationTokenObject.token);
    }

    onMessage(message, timetoken) {
        console.log('onMessage called');
        console.log(message);
        const {actionType, patientID} = message;
        switch (actionType) {
            case 'ASSIGN' :
                PatientDataService.getInstance().fetchAndSavePatientsByID([patientID])
                    .then(() => AsyncStorage.setItem('assignedVisitLastTimestamp', timetoken));
                break;
            case 'UNASSIGN' :
                PatientDataService.getInstance().archivePatient(patientID.toString(), true);
                AsyncStorage.setItem('assignedVisitLastTimestamp', timetoken);
                break;
            case 'UPDATE' :
                PatientDataService.getInstance().fetchAndEditPatientsByID([patientID])
                    .then(() => AsyncStorage.setItem('assignedVisitLastTimestamp', timetoken));
                break;
            default:
                // throw new Error('Unrecognised action type in assigned patient message');
                console.log(`unrecognised message: ${message}`);
        }
    }

    //leftover from trying to use local notifications triggered by remote silent notifications
    // notifyPatientAdditions(count = 1) {
        // const grammar = count === 1 ? 'patient' : 'patients';
        // PushNotification.localNotification({
        //     title: `New ${grammar} alert`,
        //     message: `You have ${count} new ${grammar}`,
        //     userInfo: {
        //         screenName: screenNames.patientList
        //     }
        // });
    // }
}
