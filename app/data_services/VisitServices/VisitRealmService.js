import {arrayToObjectByKey, filterResultObjectByListMembership} from '../../utils/collectionUtils';
import {Visit, VisitOrder} from '../../utils/data/schema';
import {UserDataService} from '../UserDataService';
import {VisitService} from './VisitService';

export class VisitRealmService {
    static visitRealmService;

    static initialiseService(floDB) {
        VisitRealmService.visitRealmService = new VisitRealmService(floDB);
        return VisitRealmService.visitRealmService;
    }

    static getInstance() {
        if (!VisitRealmService.visitRealmService) {
            throw new Error('Visit realm service requested before being initialised');
        }

        return VisitRealmService.visitRealmService;
    }

    constructor(floDB) {
        this.floDB = floDB;
    }

    saveVisitOrderForDate(orderedVisitID, midnightEpoch) {
        const allVisits = this.floDB.objects(Visit);
        const currentVisitListByID = arrayToObjectByKey(filterResultObjectByListMembership(allVisits, 'visitID', orderedVisitID), 'visitID');

        const visitOrder = this.floDB.objectForPrimaryKey(VisitOrder, midnightEpoch);
        this.floDB.write(() => {
            visitOrder.visitList = orderedVisitID.map(visitID => currentVisitListByID[visitID]);
        });

        return visitOrder.visitList;
    }

    getVisitsOfCurrentUserForDate(midnightEpoch) {
        const allVisits = this.floDB.objects(Visit).filtered(`midnightEpochOfVisit = ${midnightEpoch}`);
        return this.selectCurrentUserVisits(allVisits);
    }

    //TODO create legit user objects
    selectCurrentUserVisits(visits) {
        return this.filterVisitsByUserID(visits, UserDataService.getCurrentUserProps().userID);
    }

    filterVisitsByUserID(visits, userID) {
        return visits.filtered(`user.userID = "${userID}"`);
    }

    filterVisitsLessThanDate(visits, date) {
        return visits.filtered(`midnightEpochOfVisit <= ${date}`);
    }

    filterVisitsGreaterThanDate(visits, date) {
        return visits.filtered(`midnightEpochOfVisit >= ${date}`);
    }

    filterDoneVisits(visits, doneStatus) {
        return visits.filtered(`isDone = ${doneStatus}`);
    }

    sortVisitsByField(visits, field, descending) {
        if (Visit.getAllFields().includes(field)) {
            return visits.sorted(field, descending);
        }
        return visits;
    }

    getVisitByID(visitID) {
        return this.floDB.objectForPrimaryKey(Visit, visitID);
    }

    getVisitsByIDs(visitIDs) {
        return this.floDB.objects(Visit).filtered(visitIDs.map((id) => `visitID == '${id}'`).join(' OR '));
    }

    getCurrentUserVisits = () => {
        const visits = this.floDB.objects(Visit);
        return this.selectCurrentUserVisits(visits);
    }

    getDoneUserVisits = () => {
        const userVisits = this.getCurrentUserVisits();
        return this.filterDoneVisits(userVisits, true);
    }

    deleteVisitByObject(visit) {
        this.floDB.delete(visit);
    }

    getVisitOrderForDate(midnightEpoch) {
        let visitOrder = this.floDB.objectForPrimaryKey(VisitOrder, midnightEpoch);
        if (!visitOrder) {
            this.floDB.write(() => {
                visitOrder = this.floDB.create(VisitOrder, {midnightEpoch, visitList: []});
            });
        }

        return visitOrder;
    }

    getVisitOrderForDates(dates) {
        return dates.map(date => this.getVisitOrderForDate(date));
    }

    updateVisitStartTimeByID(visitID, startTime) {
        const visit = this.floDB.objectForPrimaryKey(Visit, visitID);
        this.floDB.write(() => {
                visit.plannedStartTime = startTime;
            }
        );
    }

    updateMilesDataByVisitObject(visit, odometerStart, odometerEnd, computedMiles, extraMiles, milesComments) {
        const visitMilesObject = visit.visitMiles;
        this.floDB.write(() => {
            visitMilesObject.odometerStart = odometerStart;
            visitMilesObject.odometerEnd = odometerEnd;
            visitMilesObject.computedMiles = computedMiles;
            visitMilesObject.extraMiles = extraMiles;
            visitMilesObject.milesComments = milesComments;
        });
    }

    insertNewVisits(visits, midnightEpoch) {
        const visitOrderObject = this.getVisitOrderForDate(midnightEpoch);

        let indexOfFirstDoneVisit;
        for (indexOfFirstDoneVisit = 0; indexOfFirstDoneVisit < visitOrderObject.visitList.length && !visitOrderObject.visitList[indexOfFirstDoneVisit].isDone; indexOfFirstDoneVisit++) {
        }

        const newVisitList = [];
        newVisitList.push(...visitOrderObject.visitList.slice(0, indexOfFirstDoneVisit));
        for (let j = 0; j < visits.length; j++) {
            newVisitList.push(visits[j]);
        }
        newVisitList.push(...visitOrderObject.visitList.slice(indexOfFirstDoneVisit, visitOrderObject.visitList.length));

        this.floDB.write(() => {
            visitOrderObject.visitList = newVisitList;
        });

        return newVisitList;
    }

}
