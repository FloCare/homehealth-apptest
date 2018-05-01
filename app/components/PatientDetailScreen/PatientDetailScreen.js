import React from 'react';
import {PatientDetailCard} from '../PatientDetailCard';

const PatientDetailScreen = (props) => {
    const {patientDetail, nextVisit, lastVisit, onPressAddVisit, onPressAddNotes, showCallout, setMarkerRef} = props;
    return (
        <PatientDetailCard
            patientDetail={patientDetail}
            nextVisit={nextVisit}
            lastVisit={lastVisit}
            onPressAddVisit={onPressAddVisit}
            onPressAddNotes={onPressAddNotes}
            showCallout={showCallout}
            setMarkerRef={setMarkerRef}
        />
    );
};

export {PatientDetailScreen};
