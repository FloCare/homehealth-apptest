import VisitActions from '../Actions';

export function VisitReducer(visits = {}, action) {
    switch (action.type) {
        case VisitActions.ADD_VISITS:
            return {...visits, ...action.visitList};
        case VisitActions.EDIT_VISIT:
            return {...visits, ...action.visitList};
        default:
            return visits;
    }
}
