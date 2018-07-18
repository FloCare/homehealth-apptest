import {BaseMessagingService} from './BaseMessagingService';
import {PatientDataService} from '../../PatientDataService';

export class VisitMessagingService extends BaseMessagingService {
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

    getChannelObjectsForPayload(payload) {
        const patientIDs = payload.patientIDs;
        return patientIDs.map(patientID => ({
            name: `${patientID}_visits`,
            lastMessageTimestamp: '0',
            handler: this.constructor.name,
        }));
    }

    async getSeedChannels() {
        const patients = PatientDataService.getInstance().getAllPatients().filtered('isLocallyOwned = false');
        return patients.map(patient => ({
            name: `${patient.patientID}_visits`,
            lastMessageTimestamp: '0',
            handler: this.constructor.name,
        }));
    }
}
