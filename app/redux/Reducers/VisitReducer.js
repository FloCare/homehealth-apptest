import {VisitActions} from '../Actions';

export default function VisitReducer(visits = {}, action) {
    switch (action.type) {
        case VisitActions.ADD_VISITS:
            return {...visits, ...action.visitList};
        case VisitActions.EDIT_VISIT:
            console.log(`reached edit visit reducer ${visits.length}`);
            console.log(visits);
            return {...visits, ...action.visitList};
        default:
            return visits;
    }
}
