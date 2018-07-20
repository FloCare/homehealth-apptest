import moment from 'moment';
import {Episode} from '../utils/data/schema';
import * as EpisodeAPI from '../utils/API/EpisodeAPI';

export class EpisodeDataService {
    static episodeDataService;

    static initialiseService(floDB, store) {
        EpisodeDataService.episodeDataService = new EpisodeDataService(floDB, store);
    }

    static getInstance() {
        if (!EpisodeDataService.episodeDataService) {
            throw new Error('patient data service requested before being initialised');
        }

        return EpisodeDataService.episodeDataService;
    }

    constructor(floDB, store) {
        this.floDB = floDB;
        this.store = store;
    }

    fetchEpisodeDetailsByIds(episodeIds) {
        return EpisodeAPI.getEpisodeDetailsByIds(episodeIds).then(
            (json) => json.success
        );
    }

}
