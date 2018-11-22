import moment from 'moment';
import {Note} from '../utils/data/schema';
import {getMessagingServiceInstance} from './MessagingServices/PubNubMessagingService/MessagingServiceCoordinator';
import {NotesMessagingService} from './MessagingServices/PubNubMessagingService/NotesMessagingService';
import {generateUUID} from '../utils/utils';
import {UserDataService} from './UserDataService';
import {EpisodeDataService} from './EpisodeDataService';

export class NoteDataService {
    static noteDataService;

    static initialiseService(floDB, store) {
        NoteDataService.noteDataService = new NoteDataService(floDB, store);
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    static getInstance() {
        if (!NoteDataService.noteDataService) {
            throw new Error('Note Data service called without being initialised');
        }
        return NoteDataService.noteDataService;
    }

    getNoteByID(noteID) {
        return this.floDB.objectForPrimaryKey(Note.getSchemaName(), noteID);
    }

    getNotesForEpisodeID(episodeID) {
        const episode = EpisodeDataService.getInstance().getEpisodeByID(episodeID);
        return episode.notes.sorted('timetoken');
    }

    saveNoteObject(noteObject) {
        this.floDB.write(() => {
            this.floDB.create('Note', noteObject, true);
        });
    }

    generateNewNote(message, episode) {
        const note = {
            messageID: generateUUID(),
            episode,
            messageType: 'NEW_NOTE',
            //TODO
            timetoken: moment().toDate(),
            user: UserDataService.getInstance().getUserByID(UserDataService.getCurrentUserProps().userID),
            data: message,
            synced: 'false',
        };
        return note;
    }

    generateAndPublishNote(message, episode) {
        const note = this.generateNewNote(message, episode);
        this.saveNoteObject(note);
        getMessagingServiceInstance(NotesMessagingService.identifier).publishNewNote(note);
    }

    // subscribeToVisitsForDays(NoteID, startDate, endDate, callbackFunction) {
    //     const visitsResult = VisitService.getInstance().getVisitsByNoteID(NoteID).filtered('midnightEpochOfVisit >= $0 && midnightEpochOfVisit <= $1', startDate, endDate);
    //     const realmListener = (visits) => {
    //         callbackFunction(this._getFlatVisitsByDay(visits));
    //     };
    //
    //     visitsResult.addListener(realmListener);
    //     return {
    //         currentData: this._getFlatVisitsByDay(visitsResult),
    //         unsubscribe: () => visitsResult.removeListener(realmListener),
    //     };
    // }
}
