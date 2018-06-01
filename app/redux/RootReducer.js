import {combineReducers} from 'redux';

import address from './Reducers/AddressReducer';
import patient from './Reducers/PatientReducer';
import stop from './Reducers/StopReducer';
import visit from './Reducers/VisitReducer';
import visitOrder from './Reducers/VisitOrderReducer';

export const RootReducer = combineReducers({
    address,
    patient,
    stop,
    visit,
    visitOrder,
});

