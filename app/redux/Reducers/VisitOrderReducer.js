import {VisitOrderActions} from '../Actions';

export default function VisitOrderReducer(visitOrder = [], action) {
    switch (action.type) {
        case VisitOrderActions.SET_ORDER:
            return action.visitOrder;
        default:
            return visitOrder;
    }
}

