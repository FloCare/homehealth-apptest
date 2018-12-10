import {VisitActions} from '../Actions';

export default function VisitReducer(visits = {}, action) {
    switch (action.type) {
        case VisitActions.ADD_VISITS:
            if (action.visitList) { return {...action.visitList, ...visits}; }
            return visits;
        case VisitActions.EDIT_VISITS:
            //TODO sanitation for visits not added yet
            return {...visits, ...action.visitList};
        case VisitActions.DELETE_VISITS:
            const newVisits = {...visits};
            action.visitIDs.map(visitID => delete newVisits[visitID]);
            return newVisits;
        case VisitActions.EDIT_SINGLE_VISIT:
            const visitID = action.visitID;
            if (Object.keys(visits).includes(visitID)) {
                return {
                    ...visits,
                    [visitID]: {
                        ...visits[visitID],
                        [action.updateKey]: action.updateValue
                    }
                };
            }
            return {...visits};
        default:
            return visits;
    }
}
