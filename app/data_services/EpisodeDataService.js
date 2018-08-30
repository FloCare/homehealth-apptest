import {Episode} from '../utils/data/schema';
import {VisitService} from './VisitServices/VisitService';
import {PatientDataService} from './PatientDataService';

export class EpisodeDataService {
    static episodeDataService;

    static initialiseService(floDB, store) {
        EpisodeDataService.episodeDataService = new EpisodeDataService(floDB, store);
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    static getInstance() {
        if (!EpisodeDataService.episodeDataService) {
            throw new Error('Episode Data service called without being initialised');
        }
        return EpisodeDataService.episodeDataService;
    }

    getEpisodeByID(episodeID) {
        return this.floDB.objectForPrimaryKey(Episode.getSchemaName(), episodeID);
    }

    saveVisitToEpisodeID(visit, episodeID) {
        try {
            const episode = this.floDB.objectForPrimaryKey(Episode.getSchemaName(), episodeID);
            if (!episode) {
                throw new Error('episode not found when trying to save visit');
            }
            this.floDB.write(() => {
                episode.visits.push(visit);
            });
        } catch (e) {
            console.log('error saving visit to episode');
            console.log(e);
            throw e;
        }
    }

    _getFlatVisitsByDay(visits) {
        const flatVisitForVisit = visit => {
            const user = visit.user;
            return {
                ownVisit: VisitService.isVisitOwn(visit),
                role: user.role,
                primaryContact: user.primaryContact,
                plannedStartTime: visit.plannedStartTime,
                name: PatientDataService.constructName(user.firstName, user.lastName)
            };
        };

        const flatVisitsByDate = {};
        visits.forEach(visit => {
            let visitForDayList = flatVisitsByDate[visit.midnightEpochOfVisit];
            if (!visitForDayList) {
                visitForDayList = [];
                flatVisitsByDate[visit.midnightEpochOfVisit] = visitForDayList;
            }

            visitForDayList.push(flatVisitForVisit(visit));
        });
        return flatVisitsByDate;
    }

    getAllSyncedEpisodes() {
        return this.floDB.objects(Episode).filtered('patient.isLocallyOwned = false');
    }

    getAllSyncedEpisodes() {
        return this.floDB.objects(Episode).filtered('patient.isLocallyOwned = false');
    }

    subscribeToVisitsForDays(episodeID, startDate, endDate, callbackFunction) {
        const visitsResult = VisitService.getInstance().getVisitsByEpisodeID(episodeID).filtered('midnightEpochOfVisit >= $0 && midnightEpochOfVisit <= $1', startDate, endDate);
        const realmListener = (visits) => {
            callbackFunction(this._getFlatVisitsByDay(visits));
        };

        visitsResult.addListener(realmListener);
        return {
            currentData: this._getFlatVisitsByDay(visitsResult),
            unsubscribe: () => visitsResult.removeListener(realmListener),
        };
    }
}
