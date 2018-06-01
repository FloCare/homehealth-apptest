import {combineReducers} from 'redux';

import addresses from './Reducers/AddressReducer';
import patients from './Reducers/PatientReducer';
import stops from './Reducers/StopReducer';
import visits from './Reducers/VisitReducer';
import visitOrder from './Reducers/VisitOrderReducer';

export const RootReducer = combineReducers({
    addresses,
    patients,
    stops,
    visits,
    visitOrder,
});

