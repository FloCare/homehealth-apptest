import moment from 'moment/moment';

const uuidv4 = require('uuid/v4');

function generateUUID() {
    return uuidv4();
}

function todayMomentInUTCMidnight() {
    return moment().startOf('day').add(moment().utcOffset(), 'minutes').utc();
}

function timeZoneConvertedEpoch(date) {
    return moment(date).subtract(moment().utcOffset(), 'minutes');
}

//TODO this is a workaround till we bake in redux
let onVisitListUpdateCallbacks = [];

function addListener(updateListener) {
    onVisitListUpdateCallbacks.push(updateListener);
}

function removeListener(updateListener) {
    onVisitListUpdateCallbacks = onVisitListUpdateCallbacks.filter(value => (updateListener === value ? null : value));
}

function makeCallbacks() {
    for (const updateCallback of onVisitListUpdateCallbacks) {
        updateCallback();
    }
}

export {generateUUID, addListener, removeListener, makeCallbacks, todayMomentInUTCMidnight, timeZoneConvertedEpoch};
