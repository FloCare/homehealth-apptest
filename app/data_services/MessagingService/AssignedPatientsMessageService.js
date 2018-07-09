import {AsyncStorage} from 'react-native';
import {BaseMessagingService} from './BaseMessagingService';
import {PatientDataService} from '../PatientDataService';

class AssignedPatientsMessageService extends BaseMessagingService {
    patientDataService = PatientDataService.getInstance();

    async initialChannels() {
        return await AsyncStorage.getItem('userID');
    }

    onMessage(message) {
        const {actionType, patientID} = message;
        switch (actionType) {
            case 'ASSIGN' :
                this.patientDataService.fetchAndSavePatientsByID([patientID]);
                break;
            case 'UNASSIGN' :
                this.patientDataService.archivePatient(patientID, true);
                break;
            default:
                throw new Error('Unrecognised action type in assigned patient message');
        }
    }
}
