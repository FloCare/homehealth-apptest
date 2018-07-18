import {BaseMessagingService} from './BaseMessagingService';
import {PatientDataService} from '../../PatientDataService';
import {VisitService} from '../../VisitServices/VisitService';

export class VisitMessagingService extends BaseMessagingService {
    onMessage(messageObject) {
        const {message, channel} = messageObject;
        return new Promise((resolve, reject) => {
            console.log('onMessage called');
            console.log(message);
            const {actionType, visitID, userID} = message;
            //TODO if userID is equal to my own, skip this message
            switch (actionType) {
                case 'CREATE' :
                    VisitService.getInstance().fetchAndSaveVisitsByID([visitID])
                        .then(() => resolve())
                        .catch(error => reject(error));
                    break;
                case 'DELETE' :
                    try {
                        VisitService.getInstance().deleteVisitsByID(visitID);
                    } catch (e) {
                        reject(e);
                    }
                    resolve();
                    break;
                case 'UPDATE' :
                    VisitService.getInstance().fetchAndEditVisitsByID([visitID])
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

    // onBulkMessage(messageObjects) {
    //     for (const messageObject of messageObjects) {
    //         const {message} = messageObject;
    //         const {actionType, visitID} = message;
    //         switch (actionType) {
    //             case 'CREATE' :
    //                 VisitService.getInstance().fetchAndSaveVisitsByID([visitID])
    //                     .then(() => resolve())
    //                     .catch(error => reject(error));
    //                 break;
    //             case 'DELETE' :
    //                 try {
    //                     VisitService.getInstance().deleteVisitsByID(visitID);
    //                 } catch (e) {
    //                     reject(e);
    //                 }
    //                 resolve();
    //                 break;
    //             case 'UPDATE' :
    //                 VisitService.getInstance().fetchAndEditVisitsByID([visitID])
    //                     .then(() => resolve())
    //                     .catch(error => reject(error));
    //                 break;
    //             default:
    //                 // throw new Error('Unrecognised action type in assigned patient message');
    //                 console.log(`unrecognised message: ${message}`);
    //                 reject();
    //         }
    //     }
    // }

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
