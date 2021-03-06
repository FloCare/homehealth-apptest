import {EpisodeDataService} from "../data_services/EpisodeDataService";
import {dateService, initialiseService as initialiseDate} from "../data_services/DateService";
import {PatientDataService} from "../data_services/PatientDataService";
import {PlaceDataService} from "../data_services/PlaceDataService";
import {createStore} from "redux";
import {MessagingServiceCoordinator} from "../data_services/MessagingServices/PubNubMessagingService/MessagingServiceCoordinator";
import {VisitService} from "../data_services/VisitServices/VisitService";
import {RegisterScreens} from "./index";
import {
    configure as configureNotification,
    NotificationService
} from "../data_services/MessagingServices/NotificationService";
import {FloDBProvider} from "../utils/data/schema";
import {UserDataService} from "../data_services/UserDataService";
import {initialiseService as initialiseAddressService} from "../data_services/AddressDataService";
import {PhysicianDataService} from "../data_services/PhysicianDataService";
import {TaskService} from '../data_services/TaskService';
import RNSecureKeyStore from "react-native-secure-key-store";
import {todayMomentInUTCMidnight} from "../utils/utils";
import {Provider} from "react-redux";
import {initialiseStoreAndSetUserForInstabug} from "../utils/InMemoryStore";
import {RootReducer} from "../redux/RootReducer";
import {AsyncStorage} from "react-native";
import {NoteDataService} from "../data_services/NotesDataService";
import {ImageService} from "../data_services/ImageService";


var isInitialising = false;
var isAlreadyInitialised = false;

export async function initialiseApp(key, syncDataFromServer = false) {
    if(isInitialising || isAlreadyInitialised)
        return;

    isInitialising = true;
    // Initialize the DB
    try {
        await initialiseStoreAndSetUserForInstabug();
        await FloDBProvider.initialize(key);
    } catch (err) {
        console.log('Error in initializing DB: ', err);
        throw err;
    }

    // Initialize the Redux Store
    const store = createStore(RootReducer);

    // Initialize Data Services, pass it the db and store instances
    //TODO Move all intialisations to static calls
    PatientDataService.initialiseService(FloDBProvider.db, store);
    VisitService.initialiseService(FloDBProvider.db, store);
    EpisodeDataService.initialiseService(FloDBProvider.db, store);
    NoteDataService.initialiseService(FloDBProvider.db, store);
    UserDataService.initialiseService(FloDBProvider.db, store);
    PhysicianDataService.initialiseService(FloDBProvider.db, store);
    TaskService.initialiseService(FloDBProvider.db);
    NotificationService.initialiseService(FloDBProvider.db);
    PlaceDataService.initialiseService(FloDBProvider.db, store);
    ImageService.initialiseService(FloDBProvider.db, store);
    initialiseAddressService(FloDBProvider.db, store);
    initialiseDate(FloDBProvider.db, store);

    if (syncDataFromServer) {
        console.log('syncing data from server')
        try {
            await RNSecureKeyStore.get('accessToken').then(() =>
                Promise.all([PatientDataService.getInstance().syncPatientListFromServer(), PlaceDataService.getInstance().fetchAndSavePlacesFromServer()])
                    .then(() => VisitService.getInstance().fetchAndSaveMyVisitsFromServer()));
            console.log('syncing done');
            AsyncStorage.setItem('syncDone', 'true');
        } catch (error){
            console.log('error while trying to sync. Will try on next app start');
            console.log(error);
        }
    }

    dateService.setDate(todayMomentInUTCMidnight().valueOf());
    await MessagingServiceCoordinator.initialiseService(key);
    configureNotification();

    // Register the screens
    try {
        RegisterScreens(store, Provider);
    } catch (err) {
        console.log('Error in registering screens: ', err);
        throw err;
    }
    isAlreadyInitialised = true;
    isInitialising = false;
}