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
            Object.keys(action.visitList).map(key => delete newVisits[key]);
            return newVisits;
        default:
            return visits;
    }
}
