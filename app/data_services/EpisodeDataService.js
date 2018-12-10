import {Episode} from '../utils/data/schema';
import {VisitService} from './VisitServices/VisitService';
import {PatientDataService} from './PatientDataService';
import {UserDataService} from './UserDataService';

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

    // Has to be inside write
    saveVisitToEpisodeID(visit, episodeID) {
        try {
            const episode = this.floDB.objectForPrimaryKey(Episode.getSchemaName(), episodeID);
            if (!episode) {
                throw new Error('episode not found when trying to save visit');
            }
            episode.visits.push(visit);
        } catch (e) {
            console.log('error saving visit to episode');
            console.log(e);
            throw e;
        }
    }

    _getFlatVisitsByDay(visits) {
        const flatVisitForVisit = visit => {
            const user = visit.user;
            if (!visit.user) {
                console.log('missing user for visit');
                console.log(visit);
            }
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

    removeUserFromCareTeam(episodeID, userID) {
        VisitService.getInstance().deleteVisitsOfEpisodeByUserID(episodeID, userID);
        const episode = this.getEpisodeByID(episodeID);
        if (!episode) { throw new Error('Episode not found while trying to augment care team'); }
        const existingMatchingUserObjects = episode.careTeam.filtered('userID == $0', userID);
        if (!existingMatchingUserObjects || existingMatchingUserObjects.length === 0) {
            console.log('User already is not part of care team');
            return;
        }
        const filteredCareTeam = episode.careTeam.filtered('userID != $0', userID);
        this.floDB.write(() => {
            episode.careTeam = filteredCareTeam;
        });
    }

    async ensureUserInCareTeam(episodeID, userID) {
        const episode = this.getEpisodeByID(episodeID);
        if (!episode) { throw new Error('Episode not found while trying to augment care team'); }
        const existingMatchingUserObjects = episode.careTeam.filtered('userID == $0', userID);
        if (!existingMatchingUserObjects || existingMatchingUserObjects.length === 0) {
            const user = await UserDataService.getInstance().fetchAndSaveUserToRealmIfMissing(userID);
            this.floDB.write(() => {
                episode.careTeam.push(user);
            });
        } else {
            console.log('User is already part of care team');
        }
    }

    getAllSyncedEpisodes() {
        return this.floDB.objects(Episode).filtered('patient.isLocallyOwned = false');
    }

    getAllSyncedEpisodes() {
        return this.floDB.objects(Episode).filtered('patient.isLocallyOwned = false');
    }

    subscribeToVisitsForDays(episodeID, startDate, endDate, callbackFunction) {
        console.log('trying to subscribe to visits for days');
        const visitsResult = VisitService.getInstance().getVisitsByEpisodeID(episodeID).filtered('midnightEpochOfVisit >= $0 && midnightEpochOfVisit <= $1', startDate, endDate);
        const realmListener = (visits) => {
            callbackFunction(this._getFlatVisitsByDay(visits));
        };

        visitsResult.addListener(realmListener);
        console.log('done trying to subscribe to visits for days');
        return {
            currentData: this._getFlatVisitsByDay(visitsResult),
            unsubscribe: () => visitsResult.removeListener(realmListener),
        };
    }
}
