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
        this.floDB.objectForPrimaryKey(Episode.getSchemaName(), episodeID);
    }

    _getFlatVisitsByDay(visits) {
        const flatVisitForVisit = visit => {
            const user = visit.user;
            return {
                ownVisit: VisitService.getInstance().isVisitOwn(visit),
                role: user.role,
                primaryContact: user.primaryContact,
                plannedStartTime: visit.plannedStartTime,
                name: PatientDataService.constructName(user.firstName, user.lastName)
            };
        };

        const flatVisitsByDate = {};
        visits.forEach(visit => {
            let visitForDayList = flatVisitsByDate[visit.midnightEpoch];
            if (!visitForDayList) {
                visitForDayList = [];
                flatVisitsByDate[visit.midnightEpoch] = visitForDayList;
            }

            visitForDayList.push(flatVisitForVisit(visit));
        });
    }

    getAllSyncedEpisodes() {
        return this.floDB.objects(Episode).filtered('patient.isLocallyOwned = false');
    }

    subscribeToVisitsForDays(episodeID, startDate, endDate, callbackFunction) {
        const visitsResult = VisitService.getInstance().getVisitsByEpisodeID(episodeID).filtered('midnightEpoch >= $0 && midnightEpoch <= $1', startDate, endDate);
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
